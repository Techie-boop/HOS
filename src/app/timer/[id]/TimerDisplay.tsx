"use client";

import React, { useState, useEffect } from "react";

interface Hackathon {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface TimerDisplayProps {
  hackathon: Hackathon;
}

export default function TimerDisplay({ hackathon }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    status: "NOT_STARTED" | "RUNNING" | "ENDED";
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: "NOT_STARTED",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const startMs = new Date(hackathon.startDate).getTime();
      const endMs = new Date(hackathon.endDate).getTime();
      const nowMs = Date.now();

      if (nowMs < startMs) {
        // Upcoming
        const diff = startMs - nowMs;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: "NOT_STARTED",
        });
      } else if (nowMs >= startMs && nowMs < endMs) {
        // Active
        const diff = endMs - nowMs;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: "RUNNING",
        });
      } else {
        // Completed
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: "ENDED",
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  const pad = (num: number) => String(num).padStart(2, "0");

  // Flat text colors representing state (no glowing text shadows)
  const textColorClass =
    timeLeft.status === "RUNNING"
      ? "text-red-600"
      : timeLeft.status === "NOT_STARTED"
      ? "text-amber-500"
      : "text-zinc-650";

  const separatorColorClass =
    timeLeft.status === "RUNNING"
      ? "text-red-900/60"
      : timeLeft.status === "NOT_STARTED"
      ? "text-amber-900/60"
      : "text-zinc-800";

  const subtitleText =
    timeLeft.status === "RUNNING"
      ? "HACKING IN PROGRESS"
      : timeLeft.status === "NOT_STARTED"
      ? "COUNTDOWN TO LAUNCH"
      : "HACKATHON CONCLUDED";

  const showDays = timeLeft.days > 0;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center select-none font-mono relative p-4 sm:p-8">
      {/* Centered Content Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto z-20 text-center space-y-6 sm:space-y-10 animate-in fade-in duration-300">
        
        {/* Simple Flat Inline Flex Layout with Colon Separators (forced single line) */}
        <div className={`flex flex-row items-center justify-center gap-x-1 sm:gap-x-4 md:gap-x-6 font-extrabold tracking-tighter leading-none w-full px-2 sm:px-4 ${textColorClass}`}>
          
          {showDays && (
            <>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[7.5vw] sm:text-7xl md:text-8xl lg:text-[10vw] xl:text-[12vw] font-mono leading-none">
                  {pad(timeLeft.days)}
                </span>
                <span className="text-[7px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-zinc-500 font-bold mt-2">
                  Days
                </span>
              </div>
              <span className={`text-[6vw] sm:text-6xl md:text-7xl lg:text-[8vw] font-light self-center pb-2 md:pb-6 shrink-0 ${separatorColorClass}`}>
                :
              </span>
            </>
          )}

          <div className="flex flex-col items-center shrink-0">
            <span className="text-[7.5vw] sm:text-7xl md:text-8xl lg:text-[10vw] xl:text-[12vw] font-mono leading-none">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[7px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-zinc-500 font-bold mt-2">
              Hours
            </span>
          </div>

          <span className={`text-[6vw] sm:text-6xl md:text-7xl lg:text-[8vw] font-light self-center pb-2 md:pb-6 shrink-0 ${separatorColorClass}`}>
            :
          </span>

          <div className="flex flex-col items-center shrink-0">
            <span className="text-[7.5vw] sm:text-7xl md:text-8xl lg:text-[10vw] xl:text-[12vw] font-mono leading-none">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[7px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-zinc-500 font-bold mt-2">
              Minutes
            </span>
          </div>

          <span className={`text-[6vw] sm:text-6xl md:text-7xl lg:text-[8vw] font-light self-center pb-2 md:pb-6 shrink-0 ${separatorColorClass}`}>
            :
          </span>

          <div className="flex flex-col items-center shrink-0">
            <span className="text-[7.5vw] sm:text-7xl md:text-8xl lg:text-[10vw] xl:text-[12vw] font-mono leading-none">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[7px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-zinc-500 font-bold mt-2">
              Seconds
            </span>
          </div>
        </div>

        {/* Clean Status Subtitle */}
        <div className="pt-6 border-t border-zinc-950 w-2/3 sm:w-1/2 md:w-1/3 mx-auto space-y-2">
          <span className="text-[9px] sm:text-xs tracking-[0.4em] text-zinc-500 font-bold uppercase block">
            {subtitleText}
          </span>
          <span className="text-[8px] sm:text-[10px] text-zinc-700 block font-bold tracking-[0.2em] uppercase max-w-xs sm:max-w-md mx-auto truncate">
            {hackathon.title}
          </span>
        </div>
      </div>
    </div>
  );
}
