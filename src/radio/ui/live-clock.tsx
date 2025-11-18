import React, { useState, useEffect, useMemo } from "react";

const LiveClock: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(new Date().getSeconds());
  const [baseTime, setBaseTime] = useState<Date>(new Date());

  // Update every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSeconds(now.getSeconds());

      // Update the base time every minute (to refresh hours/minutes)
      if (now.getSeconds() === 0) {
        setBaseTime(now);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time and date — memoized to avoid recomputation
  const formattedTime = useMemo(
    () =>
      baseTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [baseTime]
  );

  const formattedDate = useMemo(
    () =>
      baseTime.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [baseTime]
  );

  // Extract hour, minute, and AM/PM
  const [hourMinute, period] = formattedTime.split(" ");
  const [hours, minutes] = hourMinute.split(":");

  return (
    <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-mono">
      {/* Left: Date */}
      <span>{formattedDate}</span>

      {/* Right: Clock */}
      <div className="flex items-center gap-1">
        {/* 🔴 Live indicator */}
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>

        {/* Time display */}
        <div className="flex items-baseline text-gray-700 font-semibold">
          <span>{hours}</span>

          {/* Smooth pulsing colon */}
          <span
            className="mx-[2px] text-gray-700 animate-[pulse_2s_ease-in-out_infinite]"
            style={{
              animationName: "pulse",
              animationDuration: "2s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          >
            :
          </span>

          <span>{minutes}</span>
          <span>:</span>
          {/* Seconds */}
          <span className="ml-1 text-[10px] text-gray-600">
            {seconds.toString().padStart(2, "0")}
          </span>
          {/* AM/PM */}
          <span className="ml-1 text-[10px] opacity-80">{period}</span>
        </div>
      </div>

      {/* Keyframes for smooth colon fade */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
};

export default LiveClock;
