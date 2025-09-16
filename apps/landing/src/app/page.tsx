import Domicile from "@/components/domicile";
import FAQs from "@/components/faqs";
import { Features } from "@/components/features";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Presentation from "@/components/presentation";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      <Hero />
      <Features />
      <Presentation />
      <Pricing />t
      <Domicile />
      <Testimonials />
      <FAQs />
    </main>
  );
}
