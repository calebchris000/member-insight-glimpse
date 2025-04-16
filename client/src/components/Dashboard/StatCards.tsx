import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Users,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  LogIn,
} from "lucide-react";
import { useGlobal } from "@/context/socket.context";
import { GetTime } from "@/utils/time";

const StatCards: React.FC = () => {
  const { socket } = useGlobal();

  const [metrics, setMetrics] = useState<
    {
      title: string;
      name: string;
      value: string | number;
      change: string | number;
      Icon: React.ElementType;
    }[]
  >([
    {
      title: "activeUsers",
      name: "Active Users",
      value: 0,
      change: 0,
      Icon: Users,
    },
    {
      title: "totalLogins",
      name: "Total Logins",
      value: 0,
      change: 0,
      Icon: LogIn,
    },
    {
      title: "averageSessions",
      name: "Average Sessions",
      value: 0,
      change: 0,
      Icon: Clock,
    },
    {
      title: "pageVisits",
      name: "Page Visits",
      value: 0,
      change: 0,
      Icon: MousePointerClick,
    },
  ]);

  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <ArrowUpRight className="h-4 w-4 text-dashboard-green" />;
    } else if (value < 0) {
      return <ArrowDownRight className="h-4 w-4 text-dashboard-red" />;
    }
    return null;
  };

  useEffect(() => {
    async function fetchMetrics() {
      const response = await fetch(
        "https://member-insight-glimpse.onrender.com/visit-distribution/metrics?activeUsers=true&totalLogins=true&averageSessions=true&pageVisits=true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        const data = await response.json();
        const newMetrics = metrics.map((metric) => {
          const incomingValue = data[metric.title] ?? 0;
          const currentValue =
            metrics.find((m) => m.title === metric.title).value ?? 0;
          metric.value = incomingValue;
          metric.change = incomingValue - Number(currentValue);

          return metric;
        });

        setMetrics(newMetrics);
        // console.log(newMetrics, "metric");
      }
    }

    setInterval(() => {
      fetchMetrics();
    }, 3000);
  }, []);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            <metric.Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.title === "averageSessions"
                ? GetTime(Number(metric.value))
                : metric.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              {getTrendIcon(Number(metric.change))}
              <span
                className={
                  Number(metric.change) > 0
                    ? "text-dashboard-green"
                    : Number(metric.change) < 0
                      ? "text-dashboard-red"
                      : ""
                }
              >
                {metric.title === "averageSessions"
                  ? GetTime(Math.abs(Number(metric.change)))
                  : Math.abs(Number(metric.change))}
                &nbsp;change
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.activeUsers)}
            <span
              className={
                trends.activeUsers > 0
                  ? "text-dashboard-green"
                  : trends.activeUsers < 0
                    ? "text-dashboard-red"
                    : ""
              }
            >
              {Math.abs(trends.activeUsers)} user(s) change
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Logins Today
          </CardTitle>
          <LogIn className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLogins}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.totalLogins)}
            <span
              className={
                trends.totalLogins > 0
                  ? "text-dashboard-green"
                  : trends.totalLogins < 0
                    ? "text-dashboard-red"
                    : ""
              }
            >
              {Math.abs(trends.totalLogins)} login(s) change
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Session Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageSessionTime} min
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.averageSessionTime)}
            <span
              className={
                trends.averageSessionTime > 0
                  ? "text-dashboard-green"
                  : trends.averageSessionTime < 0
                    ? "text-dashboard-red"
                    : ""
              }
            >
              {Math.abs(trends.averageSessionTime)} min change
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Page Visits Today
          </CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pageVisitsToday}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.pageVisitsToday)}
            <span
              className={
                trends.pageVisitsToday > 0
                  ? "text-dashboard-green"
                  : trends.pageVisitsToday < 0
                    ? "text-dashboard-red"
                    : ""
              }
            >
              {Math.abs(trends.pageVisitsToday)} visit(s) change
            </span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default StatCards;
