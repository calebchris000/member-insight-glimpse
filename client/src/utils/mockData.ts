// Types for our mock data
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: "admin" | "member";
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: "login" | "logout" | "page_visit";
  page?: string;
  timestamp: Date;
}

export interface DailyStat {
  date: string;
  logins: number;
  logouts: number;
  pageVisits: number;
}

export interface PageVisit {
  page: string;
  visits: number;
}

// Mock users
const users: User[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "JS",
    email: "john@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "SJ",
    email: "sarah@example.com",
    role: "member",
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "MB",
    email: "michael@example.com",
    role: "member",
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "ED",
    email: "emily@example.com",
    role: "member",
  },
  {
    id: "5",
    name: "Daniel Wilson",
    avatar: "DW",
    email: "daniel@example.com",
    role: "member",
  },
  {
    id: "6",
    name: "Lisa Moore",
    avatar: "LM",
    email: "lisa@example.com",
    role: "member",
  },
  {
    id: "7",
    name: "Robert Taylor",
    avatar: "RT",
    email: "robert@example.com",
    role: "member",
  },
  {
    id: "8",
    name: "Jessica White",
    avatar: "JW",
    email: "jessica@example.com",
    role: "member",
  },
];

// Page names for simulated visits
const pageNames = [
  "Home",
  "Profile",
  "Settings",
  "Dashboard",
  "Products",
  "Billing",
  "Support",
  "Reports",
];

// Generate a random user activity
export const generateRandomActivity = (): Activity => {
  const user = users[Math.floor(Math.random() * users.length)];
  const types: Activity["type"][] = ["login", "logout", "page_visit"];
  const type = types[Math.floor(Math.random() * types.length)];

  const activity: Activity = {
    id: Math.random().toString(36).substring(2, 15),
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    type,
    timestamp: new Date(),
  };

  // Add page information if it's a page visit
  if (type === "page_visit") {
    activity.page = pageNames[Math.floor(Math.random() * pageNames.length)];
  }

  return activity;
};

// Generate daily stats for the past 7 days
export const generateDailyStats = (): DailyStat[] => {
  const stats: DailyStat[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split("T")[0];

    stats.push({
      date: dateStr,
      logins: Math.floor(Math.random() * 50) + 10,
      logouts: Math.floor(Math.random() * 40) + 5,
      pageVisits: Math.floor(Math.random() * 200) + 50,
    });
  }

  return stats;
};

export const generatePageVisitStats = (): PageVisit[] => {
  return pageNames.map((page) => ({
    page,
    visits: Math.floor(Math.random() * 300) + 50,
  }));
};

export const generateCurrentStats = () => {
  return {
    activeUsers: Math.floor(Math.random() * 30) + 10,
    totalLogins: Math.floor(Math.random() * 500) + 100,
    averageSessionTime: Math.floor(Math.random() * 30) + 5,
    pageVisitsToday: Math.floor(Math.random() * 1000) + 200,
  };
};
