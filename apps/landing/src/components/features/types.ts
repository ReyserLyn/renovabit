import type { ComponentType } from "react";

export interface Problem {
  issue: string;
  solution: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export interface Service {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  status: string;
}

export interface Component {
  name: string;
  specs: string;
  price: string;
  category: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export interface Feature {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className: string;
}
