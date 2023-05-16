import { useEffect, useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import differenceInSeconds from 'date-fns/differenceInSeconds';

const MINUTES_IN_SECONDS = 60

export const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState<string>(formatDistanceToNow(targetDate))

  useEffect(() => {
    // Update the time left every second
    const timer = setInterval(() => {
      const diffInSeconds = differenceInSeconds(new Date(targetDate), Date.now())
      if (diffInSeconds < 5 * MINUTES_IN_SECONDS) {
        // display an actual countdown
        const minutes = Math.floor(diffInSeconds / 60)
        const seconds = diffInSeconds % 60
        setTimeLeft(`${minutes ? `${minutes}min ` : `${seconds} seconds`}`)
        return
      }
      setTimeLeft(formatDistanceToNow(new Date(targetDate)));
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft
};