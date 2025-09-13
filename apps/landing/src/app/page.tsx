import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Presentation from "@/components/presentation";
import Services from "@/components/services";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      <Hero />
      <Services />
      <Presentation />
    </main>
  );
}
