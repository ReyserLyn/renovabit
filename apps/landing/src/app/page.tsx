import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Services from "@/components/services";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      <Hero />

      <Services />
    </main>
  );
}
