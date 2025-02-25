import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Globe, MousePointer, Activity } from 'lucide-react';
import './App.css';

const App = () => {
  const [analytics, setAnalytics] = useState({
    activeUsers: 0,
    pageViews: {},
    locations: {},
    events: []
  });

  useEffect(() => {
    const socket = io('http://localhost:4000');
    
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
    <div className="dashboard">
      <h1>Real-Time Analytics Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Active Users</h3>
            <Users className="icon" />
          </div>
          <div className="metric-value">{analytics.activeUsers}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Total Page Views</h3>
            <MousePointer className="icon" />
          </div>
          <div className="metric-value">
            {Object.values(analytics.pageViews).reduce((a, b) => a + b, 0)}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Unique Locations</h3>
            <Globe className="icon" />
          </div>
          <div className="metric-value">
            {Object.keys(analytics.locations).length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Total Events</h3>
            <Activity className="icon" />
          </div>
          <div className="metric-value">{analytics.events.length}</div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="chart-card">
        <h2>Activity Over Time</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Table */}
      <div className="table-card">
        <h2>User Locations</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.locations).map(([location, count]) => (
                <tr key={location}>
                  <td>{location}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
