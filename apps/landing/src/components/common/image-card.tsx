import Image from "next/image";
import type { ReactNode } from "react";

interface ImageCardProps {
  image: string;
  alt: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconSize?: number;
  aspectRatio?: "video" | "square";
  width: number;
  height: number;
  children?: ReactNode;
  className?: string;
  iconBgColor?: string;
  containerClassName?: string;
}

export const ImageCard = ({
  image,
  alt,
  description,
  icon: Icon,
  iconSize = 16,
  aspectRatio = "video",
  width,
  height,
  children,
  className = "",
  iconBgColor = "bg-primary/90 text-primary-foreground",
  containerClassName = "",
}: ImageCardProps) => {
  const aspectClass =
    aspectRatio === "video" ? "aspect-video" : "aspect-square";

  return (
    <div
      className={`relative mx-auto mb-2 rounded-2xl group ${aspectClass} ${containerClassName || "w-full"} ${className}`}
    >
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="object-cover rounded-2xl transition-transform duration-500 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-medium">{description}</p>
      </div>
      <div
        className={`absolute top-2 right-2 ${iconBgColor} rounded-full p-1.5 z-10 group-hover:scale-110 transition-transform duration-500`}
      >
        <Icon size={iconSize} />
      </div>
      {children}
    </div>
  );
};
