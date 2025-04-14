import express from "express";
import http from "http";
import morgan from "morgan";
import { mongo } from "./mongo.js";
import cors from "cors";
import { SeederService } from "./seeder.js";
import User from "./user.model.js";
import Activity, { ActivityType } from "./activity.model.js";
import { SocketServer } from "./socket.js";
import { GetTime } from "./utils/time.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

(() => {
  mongo();
  SeederService();
})();

//* Only three routes, Home, Settings, and Profile will be created for this test
app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome" });
});

const socket = new SocketServer(server);
socket.setupSocket();

const UserMiddleware = async (req, res, next) => {
  const userId = req.body.userId || req.params.userId || req.query.userId;
  const email = req.body.email;
  const user = await User.findOne(email ? { email } : { id: userId });
  if (!user) {
    res.status(404).json({ message: "User not found!" });
  } else {
    req.user = user;
    next();
  }
};

// I will never store passwords in plain text 😂
app.post("/auth/login", UserMiddleware, async (req, res) => {
  const { email, password } = req.body;
  const user = req.user;

  if (user.password !== password) {
    res.status(401).json({ message: "Invalid credentials" });
  } else {
    user.loggedIn = true;
    user.lastLogin = new Date();
    user.lastLogout = null;
    user.loggedInCount += 1;
    await user.save();
    const newActivity = new Activity({
      type: ActivityType.LOGIN,
      userId: user._id,
    });

    await newActivity.save();
    socket.sendActivity({
      id: newActivity.id,
      user: { id: user._id, fullName: `${user.firstName} ${user.lastName}` },
      type: ActivityType.LOGIN,

      timestamp: Date.now(),
    });

    res.status(200).json({ message: "Login success", token: "" });
  }
});

app.post("/auth/logout", UserMiddleware, async (req, res) => {
  const user = req.user;

  const newActivity = new Activity({
    type: ActivityType.LOGOUT,
    userId: user._id,
  });

  user.loggedIn = false;
  user.lastLogout = new Date();
  await user.save();

  await newActivity.save();

  socket.sendActivity({
    id: newActivity.id,
    user: { id: user._id, fullName: `${user.firstName} ${user.lastName}` },
    type: ActivityType.LOGOUT,
    timestamp: Date.now(),
  });

  res.status(204).json({});
});

app.post("/track", UserMiddleware, async (req, res) => {
  const { route } = req.body;
  const user = req.user;

  const newActivity = new Activity({
    type: ActivityType.VISIT,
    route,
    userId: user._id,
  });

  await newActivity.save();
  socket.sendActivity({
    user: { id: user._id, fullName: `${user.firstName} ${user.lastName}` },
    type: ActivityType.VISIT,
    route,
    timestamp: Date.now(),
  });
  res.status(200).json({ message: `${user.firstName} visited ${route}` });
});

app.get("/visit-distribution", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      type: ActivityType.VISIT,
      createdAt: { $gte: startOfDay },
    });

    const distribution = activities.reduce((acc, activity) => {
      const route = activity.route || "unknown";
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(distribution);
  } catch (error) {
    console.error("Error getting visit distribution:", error);
    res.status(500).json({ message: "Failed to retrieve visit distribution" });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const activities = await Activity.find();

    const stats = activities.reduce((acc, activity) => {
      const date = new Date(activity.createdAt)
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-");

      if (!acc[date]) {
        acc[date] = {
          date,
          logins: 0,
          logouts: 0,
          pageVisits: 0,
        };
      }

      if (activity.type === ActivityType.LOGIN) {
        acc[date].logins += 1;
      } else if (activity.type === ActivityType.LOGOUT) {
        acc[date].logouts += 1;
      } else if (activity.type === ActivityType.VISIT) {
        acc[date].pageVisits += 1;
      }

      return acc;
    }, {});

    const statistics = Object.values(stats);
    res.json({ message: "Success", stats: statistics });
  } catch (error) {
    console.error("Error getting daily stats:", error);
    res.status(500).json({ message: "Failed to retrieve daily stats" });
  }
});

app.get("/users-per-hour", async (req, res) => {
  try {
    const currentDay = new Date().setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      type: ActivityType.LOGIN,
      createdAt: { $gte: currentDay },
    });

    const uniqueActivities = new Map();

    for (let i = 0; i < activities.length; i += 1) {
      const activity = activities[i];
      if (!uniqueActivities.has(activity.userId.toString())) {
        uniqueActivities.set(activity.userId.toString(), activity);
      }
    }

    const usersPerHour = Array.from(uniqueActivities.values()).reduce(
      (acc, user) => {
        const hour = new Date(user.createdAt)
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .split(" ")[0];
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {},
    );
    res.status(200).json(usersPerHour);
  } catch (error) {
    console.error("Error getting users per hour:", error);
    res.status(500).json({ message: "Failed to retrieve users per hour data" });
  }
});

app.get("/metrics", async (req, res) => {
  try {
    const activeUsers = req.query.activeUsers;
    const totalLogins = req.query.totalLogins;
    const averageSessions = req.query.averageSessions;
    const pageVisits = req.query.pageVisits;
    const startOfDay = new Date();
    const results = {};
    startOfDay.setHours(0, 0, 0, 0);

    if (activeUsers === "true") {
      const users = await User.find({ loggedIn: true });
      results.activeUsers = users.length;
    }
    if (totalLogins === "true") {
      const loginCount = await User.find({
        loggedInCount: { $gte: 1 },
        lastLogin: { $gte: startOfDay },
      });

      results.totalLogins = loginCount.reduce(
        (acc, curr) => acc + curr.loggedInCount,
        0,
      );
    }

    if (averageSessions === "true") {
      const users = await User.find();
      const sessions = users
        .map((user) => {
          const sessionTime = user.loggedIn
            ? new Date().getTime() - new Date(user.lastLogin).getTime()
            : user.lastLogout
              ? new Date(user.lastLogout).getTime() -
                new Date(user.lastLogin).getTime()
              : 0;
          return sessionTime;
        })
        .filter(Boolean);

      const totalSessions = sessions.reduce((acc, curr) => acc + curr, 0);
      const averageSessionTime = Math.floor(totalSessions / sessions.length);

      results.averageSessions = averageSessionTime;
    }
    if (pageVisits === "true") {
      const activities = await Activity.find({
        type: ActivityType.VISIT,
        createdAt: { $gte: startOfDay },
      });

      results.pageVisits = activities.length;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting metrics:", error);
    res.status(500).json({ message: "Failed to retrieve metrics" });
  }
});

server.listen("3000", () => {
  console.log("Server started");
});
