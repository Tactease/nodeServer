import React from 'react';
import Schedule from './schedule';
import './main.css';

function Main({ missions }) {
  return (
    <main className="main">
      {/* Render the Schedule component and pass missions data */}
      <Schedule missions={missions} />
    </main>
  );
}

export default Main;