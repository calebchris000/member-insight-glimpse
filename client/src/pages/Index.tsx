
import React from 'react';
import Header from '@/components/Dashboard/Header';
import StatCards from '@/components/Dashboard/StatCards';
import Charts from '@/components/Dashboard/Charts';
import ActivityFeed from '@/components/Dashboard/ActivityFeed';
import { LogIn } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Header />
        
        <div className="mb-6">
          <StatCards />
        </div>
        
        <div className="mb-6">
          <Charts />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-card rounded-lg p-4 shadow-sm dark:shadow-none border border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <LogIn className="mr-2 h-5 w-5" />
                Active Sessions
              </h2>
              <div className="relative w-full h-[400px] bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Session map would appear here</p>
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  {/* World map visualization would be here in a real app */}
                  <div className="absolute h-3 w-3 bg-dashboard-blue rounded-full animate-pulse-opacity" style={{ top: '40%', left: '20%' }}></div>
                  <div className="absolute h-2 w-2 bg-dashboard-purple rounded-full animate-pulse-opacity" style={{ top: '30%', left: '50%' }}></div>
                  <div className="absolute h-4 w-4 bg-dashboard-green rounded-full animate-pulse-opacity" style={{ top: '60%', left: '80%' }}></div>
                  <div className="absolute h-2 w-2 bg-dashboard-blue rounded-full animate-pulse-opacity" style={{ top: '70%', left: '40%' }}></div>
                  <div className="absolute h-3 w-3 bg-dashboard-purple rounded-full animate-pulse-opacity" style={{ top: '20%', left: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
