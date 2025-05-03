
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { busSchedules } from '@/lib/mockData';
import { formatTime } from '@/lib/calculationUtils';
import { Bus, Clock, ArrowRight } from 'lucide-react';

const BusSchedulePage = () => {
  // Group bus schedules by route
  const routes = [...new Set(busSchedules.map(schedule => schedule.routeNumber))];
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bus Schedule
        </h1>
        <p className="text-white/70 mb-8">
          Campus shuttle timings and routes
        </p>
        
        <Tabs defaultValue={routes[0]} className="w-full">
          <TabsList className="mb-6 bg-secondary/40">
            {routes.map(route => (
              <TabsTrigger key={route} value={route}>
                Route {route}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {routes.map(route => (
            <TabsContent key={route} value={route} className="space-y-4">
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-campus-purple" />
                    Route {route} Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {busSchedules
                      .filter(schedule => schedule.routeNumber === route)
                      .map((schedule) => (
                        <div key={schedule.id} className="flex border-b border-white/10 pb-4 last:border-0 last:pb-0">
                          <div className="w-24 text-center border-r border-white/10 pr-4 mr-4 flex flex-col items-center justify-center">
                            <Clock className="h-4 w-4 mb-1 text-white/60" />
                            <div className="text-sm font-medium text-white">
                              {formatTime(schedule.departureTime)}
                            </div>
                            <div className="text-xs text-white/60">
                              Departure
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium text-white">
                                {schedule.from}
                              </h4>
                              <ArrowRight className="h-3 w-3 mx-2 text-white/40" />
                              <h4 className="font-medium text-white">
                                {schedule.to}
                              </h4>
                            </div>
                            
                            <div className="text-sm text-white/70">
                              Arrival: {formatTime(schedule.arrivalTime)}
                            </div>
                            
                            <div className="text-xs text-white/50 mt-2">
                              {schedule.stops.length} stops
                            </div>
                            
                            <div className="mt-2">
                              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                                View Stops
                              </Button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BusSchedulePage;
