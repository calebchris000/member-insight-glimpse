import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DailyStat, PageVisit } from "@/utils/mockData";
import { useGlobal } from "@/context/socket.context";

const Charts: React.FC = () => {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [activePerHour, setActivePerHour] = useState<
    { hour: string; users: number }[]
  >([]);

  useEffect(() => {
    async function fetchDistribution() {
      const response = await fetch(
        "https://member-insight-glimpse.onrender.com/visit-distribution",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const data = await response.json();
        Object.entries(data).forEach((distribution) => {
          setPageVisits((curr) => [
            ...curr,
            { page: distribution[0], visits: Number(distribution[1]) },
          ]);
        });
      }
    }
    fetchDistribution();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch(
        "https://member-insight-glimpse.onrender.com/visit-distribution/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const data = await response.json();
        setDailyStats(data.stats);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchActiveUsersByHour() {
      const response = await fetch(
        "https://member-insight-glimpse.onrender.com/visit-distribution/users-per-hour",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const data = Object.entries(await response.json()).map((entry) => {
          return { hour: entry[0], users: entry[1] };
        });

        setActivePerHour(data as { hour: string; users: number }[]);
      }
    }
    fetchActiveUsersByHour();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0"];

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={dailyStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(15 23 42)",
                  borderColor: "rgb(30 41 59)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value}`, ""]}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="logins"
                name="Logins"
                stroke="#4361ee"
                fill="#4361ee"
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="logouts"
                name="Logouts"
                stroke="#e74c3c"
                fill="#e74c3c"
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="pageVisits"
                name="Page Visits"
                stroke="#7209b7"
                fill="#7209b7"
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Visit Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pageVisits}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="visits"
                nameKey="page"
              >
                {pageVisits.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(15 23 42)",
                  borderColor: "rgb(30 41 59)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Users by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={activePerHour}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                interval={3} // Show fewer x-axis labels
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(15 23 42)",
                  borderColor: "rgb(30 41 59)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value} users`, "Active"]}
              />
              <Bar
                dataKey="users"
                name="Active Users"
                fill="#4361ee"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
