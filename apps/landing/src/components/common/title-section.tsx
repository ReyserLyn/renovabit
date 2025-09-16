interface TitleSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function TitleSection({
  title,
  subtitle,
  description,
}: TitleSectionProps) {
  return (
    <div className="px-8 text-center">
      <h2 className="text-sm md:text-base font-medium text-primary uppercase tracking-wider">
        {title}
      </h2>

      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
        {subtitle}
      </h1>

      <p className="text-sm md:text-base my-4 lg:text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
