// src/components/LanyardPresence.tsx
import React from 'react';
import { useLanyard } from '../lanyard';
import '../styles/LanyardPresence.css';

const LanyardPresence: React.FC = () => {
  const { presence, loading } = useLanyard();

  if (loading) {
    return <div className="lanyard-container">Loading...</div>;
  }

  if (!presence) {
    return <div className="lanyard-container">Failed to load presence.</div>;
  }

  return (
    <div className="lanyard-container">
      <p className="lanyard-status">Status: {presence.discord_status}</p>
      {presence.activities.map((activity, index) => (
        <div key={index} className="lanyard-activity">
          <p>Activity: {activity.name}</p>
          <p>Details: {activity.details}</p>
          <p>State: {activity.state}</p>
        </div>
      ))}
    </div>
  );
};

export default LanyardPresence;
