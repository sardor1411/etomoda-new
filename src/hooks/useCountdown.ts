import { useState, useEffect } from 'react';

export function useCountdown(endDateStr?: string) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; expired: boolean } | null>(null);

  useEffect(() => {
    if (!endDateStr) {
      setTimeLeft(null);
      return;
    }

    const endDate = new Date(endDateStr).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, expired: true });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, minutes, expired: false });
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000); // update every minute
    return () => clearInterval(interval);
  }, [endDateStr]);

  return timeLeft;
}
