import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-surface-2/80", className)}
      {...props}
    />
  );
}

export default Skeleton;
