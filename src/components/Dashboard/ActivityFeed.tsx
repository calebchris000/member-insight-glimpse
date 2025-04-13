
import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, generateRandomActivity } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, MousePointerClick } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [liveIndicator, setLiveIndicator] = useState(false);
  
  // Simulate real-time activity updates
  useEffect(() => {
    // Generate initial activities
    const initialActivities = Array(10).fill(null).map(() => generateRandomActivity());
    setActivities(initialActivities);
    
    // Add new activities periodically
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      setActivities(prevActivities => [newActivity, ...prevActivities].slice(0, 20));
      
      // Blink the live indicator
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return <LogIn size={16} className="text-dashboard-green" />;
      case 'logout':
        return <LogOut size={16} className="text-dashboard-red" />;
      case 'page_visit':
        return <MousePointerClick size={16} className="text-dashboard-blue" />;
      default:
        return null;
    }
  };
  
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'login':
        return 'logged in';
      case 'logout':
        return 'logged out';
      case 'page_visit':
        return `visited ${activity.page}`;
      default:
        return '';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Activity Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Live</span>
          <div 
            className={`w-2 h-2 rounded-full bg-dashboard-green ${liveIndicator ? 'animate-pulse-opacity' : ''}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 animate-fade-in"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {activity.userAvatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {activity.userName}
                    </p>
                    {getActivityIcon(activity.type)}
                    <p className="text-sm text-muted-foreground">
                      {getActivityText(activity)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
