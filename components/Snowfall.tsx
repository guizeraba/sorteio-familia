import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    // Create fixed number of snowflakes
    const flakeCount = 20;
    setFlakes(Array.from({ length: flakeCount }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {flakes.map((i) => (
        <div
          key={i}
          className="absolute text-white/40 text-2xl animate-bounce-slow"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `-20px`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${10 + Math.random() * 20}px`
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
