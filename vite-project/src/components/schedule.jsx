import React from 'react';
import Mission from './mission';
import './schedule.css';

function Schedule({ missions }) {
  // Function to calculate the left position based on the day
  const calculateLeftPosition = (day) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return `${(daysOfWeek.indexOf(day) * 100) / 7}%`;
  };

  // Function to calculate the top position based on the start time
  const calculateTopPosition = (startTime) => {
    const [hour, minute] = startTime.split(':').map(Number);
    return `${(hour * 60 + minute) / 10}px`;
  };

  return (
    <div className="schedule">
      {/* Iterate over missions and render Mission components */}
      {missions.map(mission => (
        <Mission
          key={mission.missionId}
          mission={mission}
          style={{
            left: calculateLeftPosition(mission.day.toLowerCase()),
            top: calculateTopPosition(mission.startDate.split(' ')[1]),
          }}
        />
      ))}
    </div>
  );
}

export default Schedule;