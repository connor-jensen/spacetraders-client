"use client"
import { useEffect, useState } from "react";

export default function RadialProgress({seconds} : { seconds: number}) {

  const [timeRemaining, setTimeRemaining] = useState(seconds)

  const progress = (timeRemaining / seconds) * 360;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(t => t - 0.25)
      }
    }, 250)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [timeRemaining])

  return (
    <div style={{ '--progress': `${progress}deg`} as React.CSSProperties}>
      <div className="rounded-full h-8 w-8 bg-background flex items-center justify-center">
        <div className="rounded-full h-6 w-6 conic-progress flex items-center justify-center">
          <div className="rounded-full h-5 w-5 bg-background"></div>
        </div>
      </div>
    </div>
  );
}
