import { Badge } from "@renovabit/ui/src/components/ui/badge";
import { Button } from "@renovabit/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@renovabit/ui/src/components/ui/card";
import { Check, Star } from "lucide-react";
import Link from "next/link";

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
  href: string;
  buttonEffect:
    | "shineHover"
    | "expandIcon"
    | "expandIconRing"
    | "underline"
    | "gradientSlideShow"
    | "gooeyRight"
    | "gooeyLeft"
    | "ringHover"
    | "hoverUnderline";
  buttonIcon: React.ElementType;
  buttonIconPlacement: "left" | "right";
}

export default function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card
      className={`
    relative flex flex-col transition-all duration-300 hover:shadow-xl 
    ${
      plan.isPopular
        ? "bg-gradient-to-br from-accent/5 to-accent/10 border-primary/30 shadow-lg scale-105"
        : "bg-gradient-to-br from-card to-muted/20 border-border hover:border-primary/20"
    }
  `}
    >
      {/* Badge Popular */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground border-primary/20 shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            Más Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle
          className={`text-lg font-bold ${plan.isPopular ? "text-primary" : ""}`}
        >
          {plan.name}
        </CardTitle>
        <div className="my-4">
          <span className="text-3xl font-bold">
            {plan.currency}
            {plan.price}
          </span>
          <span className="text-muted-foreground text-sm ml-1">
            {plan.period}
          </span>
        </div>
        <CardDescription className="text-sm">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <hr className="border-dashed border-border" />

        <ul className="space-y-3 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-6">
        <Button
          asChild
          variant={plan.buttonVariant}
          effect={plan.buttonEffect}
          icon={plan.buttonIcon}
          iconPlacement={plan.buttonIconPlacement}
          className={`w-full transition-all duration-300 hover:scale-105 ${
            plan.isPopular
              ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
              : "border-primary/30 hover:bg-primary/10"
          }`}
        >
          <Link href={plan.href}>{plan.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
