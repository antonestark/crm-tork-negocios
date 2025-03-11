
import React, { useEffect, useState } from 'react';

interface CountUpProps {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
}

export const CountUp = ({ start = 0, end, duration = 2, decimals = 0 }: CountUpProps) => {
  const [count, setCount] = useState(start);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(progress * (end - start) + start);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration]);
  
  return <span>{count.toFixed(decimals)}</span>;
};
