import Domicile from "@/components/domicile";
import FAQs from "@/components/faqs";
import { Features } from "@/components/features";
import Hero from "@/components/hero";
import Presentation from "@/components/presentation";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="container">
      <Hero />
      <Features />
      <Presentation />
      <Pricing />
      <Domicile />
      <Testimonials />
      <FAQs />
    </main>
  );
}
