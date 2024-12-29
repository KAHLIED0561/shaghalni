"use client";

import { format, isThisWeek, isToday } from "date-fns";

const TimeDateFormate = ({ timestamp }: { timestamp: string }) => {
  return (
    <>
      {!timestamp
        ? ""
        : isToday(new Date(timestamp))
          ? format(new Date(timestamp), "hh:mm a")
          : isThisWeek(new Date(timestamp))
            ? format(new Date(timestamp), "EEEE, hh:mm a")
            : format(new Date(timestamp), "yyyy-MM-dd, hh:mm a")}
    </>
  );
};

export default TimeDateFormate;
