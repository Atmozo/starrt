import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Globe, MousePointer, Activity } from 'lucide-react';
import * as THREE from 'three';

const App = () => {
  const [analytics, setAnalytics] = useState({
    activeUsers: 0,
    pageViews: {},
    locations: {},
    events: []
  });
  const globeRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    
    socket.on('analytics-update', (data) => {
      setAnalytics(data);
    });

    return () => socket.disconnect();
  }, []);

  // Convert events to chart data
  const chartData = analytics.events
    .reduce((acc, event) => {
      const date = new Date(event.timestamp);
      const hour = date.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

  const lineChartData = Object.entries(chartData)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Real-Time Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(analytics.pageViews).reduce((a, b) => a + b, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(analytics.locations).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.events.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Location Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Location</th>
                  <th className="text-right p-4">Users</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.locations).map(([location, count]) => (
                  <tr key={location} className="border-b">
                    <td className="p-4">{location}</td>
                    <td className="text-right p-4">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
