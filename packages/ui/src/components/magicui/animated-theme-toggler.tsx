"use client";

import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "../../utils/cn";

type props = {
  className?: string;
  size?: number;
};

export const AnimatedThemeToggler = ({ className, size = 20 }: props) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          className,
          "hover:cursor-pointer hover:bg-primary/10 transition-all duration-200 rounded-full p-2 hover:text-primary",
        )}
        type="button"
        disabled
      >
        <div
          style={{ width: size, height: size }}
          className="bg-muted animate-pulse rounded-full"
        />
      </button>
    );
  }

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(
        className,
        "hover:cursor-pointer hover:bg-primary/10 transition-all duration-200 rounded-full p-2 hover:text-primary",
      )}
      type="button"
    >
      {resolvedTheme === "dark" ? <SunDim size={size} /> : <Moon size={size} />}
    </button>
  );
};
