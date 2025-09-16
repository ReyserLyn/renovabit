import { Features } from "@/components/features";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Presentation from "@/components/presentation";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      <Hero />
      <Features />

      <Presentation />
    </main>
  );
}
