import createContextHook from "@nkzw/create-context-hook";
import { useState } from "react";

interface ActiveSession {
  id: string;
  station: string;
  battery: number;
  power: number;
  duration: string;
  startTime: Date;
}

interface Booking {
  id: string;
  station: string;
  location: string;
  date: string;
  time: string;
}

interface ChargingHistory {
  id: string;
  station: string;
  date: string;
  energy: number;
  amount: number;
}

export const [ChargingProvider, useCharging] = createContextHook(() => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  
  const [upcomingBookings] = useState<Booking[]>([
    {
      id: "1",
      station: "Hitech City",
      location: "HITEC City, Madhapur",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
    },
    {
      id: "2",
      station: "Gachibowli",
      location: "Financial District",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
    },
  ]);

  const [chargingHistory] = useState<ChargingHistory[]>([
    {
      id: "1",
      station: "Banjara Hills",
      date: "Dec 15, 2024",
      energy: 45.2,
      amount: 678,
    },
    {
      id: "2",
      station: "Charminar",
      date: "Dec 14, 2024",
      energy: 32.8,
      amount: 492,
    },
    {
      id: "3",
      station: "Shamshabad RGIA",
      date: "Dec 12, 2024",
      energy: 28.5,
      amount: 428,
    },
  ]);

  const startSession = (stationName: string) => {
    setActiveSession({
      id: Date.now().toString(),
      station: stationName,
      battery: 45,
      power: 120,
      duration: "00:00",
      startTime: new Date(),
    });
  };

  const stopSession = () => {
    setActiveSession(null);
  };

  return {
    activeSession,
    upcomingBookings,
    chargingHistory,
    startSession,
    stopSession,
  };
});