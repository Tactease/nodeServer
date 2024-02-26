import React from 'react';
import './Mission.css';

function Mission({ mission, style }) {
  return (
    <div className="mission" style={style}>
      <p className="mission-name">{mission.missionType}</p>
    </div>
  );
}

export default Mission;