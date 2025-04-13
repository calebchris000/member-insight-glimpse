
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateCurrentStats } from '@/utils/mockData';
import { Clock, Users, MousePointerClick, ArrowUpRight, ArrowDownRight, LogIn } from 'lucide-react';

const StatCards: React.FC = () => {
  const [stats, setStats] = useState(generateCurrentStats());
  const [trends, setTrends] = useState({
    activeUsers: 0,
    totalLogins: 0,
    averageSessionTime: 0,
    pageVisitsToday: 0
  });
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newStats = generateCurrentStats();
      
      // Calculate trend direction (positive or negative change)
      setTrends({
        activeUsers: newStats.activeUsers - stats.activeUsers,
        totalLogins: newStats.totalLogins - stats.totalLogins,
        averageSessionTime: newStats.averageSessionTime - stats.averageSessionTime,
        pageVisitsToday: newStats.pageVisitsToday - stats.pageVisitsToday
      });
      
      setStats(newStats);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stats]);
  
  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <ArrowUpRight className="h-4 w-4 text-dashboard-green" />;
    } else if (value < 0) {
      return <ArrowDownRight className="h-4 w-4 text-dashboard-red" />;
    }
    return null;
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Users
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.activeUsers)}
            <span className={trends.activeUsers > 0 ? 'text-dashboard-green' : trends.activeUsers < 0 ? 'text-dashboard-red' : ''}>
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
            <span className={trends.totalLogins > 0 ? 'text-dashboard-green' : trends.totalLogins < 0 ? 'text-dashboard-red' : ''}>
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
          <div className="text-2xl font-bold">{stats.averageSessionTime} min</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {getTrendIcon(trends.averageSessionTime)}
            <span className={trends.averageSessionTime > 0 ? 'text-dashboard-green' : trends.averageSessionTime < 0 ? 'text-dashboard-red' : ''}>
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
            <span className={trends.pageVisitsToday > 0 ? 'text-dashboard-green' : trends.pageVisitsToday < 0 ? 'text-dashboard-red' : ''}>
              {Math.abs(trends.pageVisitsToday)} visit(s) change
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
