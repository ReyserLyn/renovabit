"use client";

import { useTheme } from "next-themes";

interface RenovaBitPinProps {
  size?: number;
}

export function RenovaBitPin({ size = 40 }: RenovaBitPinProps) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute"
        style={{
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.6,
          height: 4,
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />

      <div
        className="relative rounded-full shadow-lg border-2 overflow-hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: isDark ? "#070311" : "#f9f8ff",
          borderColor: isDark ? "#a48fff" : "#654fcc",
        }}
      >
        <div className="absolute inset-1 flex items-center justify-center">
          {logoSVG(isDark, size)}
        </div>
      </div>

      <div
        className="absolute"
        style={{
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: `6px solid transparent`,
          borderRight: `6px solid transparent`,
          borderTop: `8px solid ${isDark ? "#a48fff" : "#654fcc"}`,
        }}
      />
    </div>
  );
}

const logoSVG = (isDark: boolean, size: number) => (
  <svg
    viewBox="0 0 1024 1024"
    className="w-full h-full"
    style={{ width: size * 0.7, height: size * 0.7 }}
  >
    <g>
      <path
        d="M923.35,567.12c-13.77-21.23-30.13-37.59-49.08-49.07-18.95-11.49-36.15-18.95-51.66-22.4v-6.88c13.79-4.01,27.99-11.61,42.62-22.81,14.63-11.2,27.13-26.12,37.46-44.76,10.32-18.66,15.5-42.05,15.5-70.18s-7.48-54.95-22.4-78.77c-14.92-23.82-36.58-42.91-65-57.25-28.4-14.34-63.27-21.54-104.6-21.54h-294.43v119.14l66.91,5.65,54.51,72.45-21.92,80.66-34.76,38.14-64.74,10.27v167.88l45.69,15.55,57.94,127.37h197.7c49.92,0,90.53-8.9,121.8-26.7,31.28-17.78,53.95-40.46,68.02-68,14.06-27.56,21.09-56.25,21.09-86.11,0-33.85-6.88-61.41-20.65-82.63ZM564.33,304.52h139.48c29.84,0,51.66,7.32,65.43,21.95,13.77,14.63,20.67,32,20.67,52.1s-6.9,38.18-20.67,52.51c-13.77,14.36-35.59,21.54-65.43,21.54h-139.48v-148.09ZM787.75,694.96c-15.23,16.36-39.77,24.54-73.61,24.54h-149.81v-10.76h-3.5s-34.26-14.79-37.33-17.35-23.52-37.84-24.03-41.42c-.51-3.58-7.67-28.12-7.67-28.12l15.34-16.36,31.19-22.5,26,5v-33.8h149.81c33.85,0,58.39,8.06,73.61,24.11,15.19,16.07,22.81,35.31,22.81,57.69s-7.62,42.62-22.81,58.98Z"
        fill={isDark ? "#e8e9ff" : "#1a1a36"}
      />
      <g>
        <path
          d="M589.2,730.67l69.85,99.88h-155.72l-162.84-232.91-62.51-85.64h157.94c26.03,0,48.49-9.34,67.4-28.25,18.69-18.69,28.25-41.15,28.25-67.18s-9.57-48.72-28.25-67.4c-18.91-18.91-41.38-28.25-67.4-28.25H80l60.51-127.47h295.42c59.39,0,110.56,20.47,153.27,61.62,1.34,1.11,2.89,2.67,4.23,4,43.6,43.6,65.63,96.1,65.63,157.5,0,47.16-13.57,89.87-40.71,127.69-8.9,12.46-18.69,23.8-29.14,33.81-21.35,20.69-46.04,36.04-74.07,46.72l74.07,105.89Z"
          fill={isDark ? "#a48fff" : "#654fcc"}
        />
        <polygon
          points="454.84 830.56 299.12 830.56 213.03 705.31 179.66 656.82 169.87 642.8 80 512 233.27 512 287.11 589.41 292.89 597.64 340.49 666.16 373.42 713.32 373.86 715.32 373.86 714.21 454.84 830.56"
          fill={isDark ? "#a48fff" : "#654fcc"}
        />
      </g>
    </g>
  </svg>
);
