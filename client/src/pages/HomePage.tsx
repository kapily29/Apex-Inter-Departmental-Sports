import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import StatsRow from "../components/home/StatsRow";
import UpcomingMatches from "../components/home/UpcomingMatches";
import LatestResults from "../components/home/LatestResults";
import Announcements from "../components/home/Announcements";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100">
      <Navbar />

      <main className="relative">
        {/* subtle top glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-blue-100/50 via-transparent to-transparent" />

        <Hero />
        <StatsRow />

        <section className="mx-auto max-w-6xl px-4 py-12">
          {/* Soft container effect */}
          <div className="rounded-2xl bg-white/60 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur-md md:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left side (2 columns) */}
              <div className="space-y-8 lg:col-span-2">
                <UpcomingMatches />
                <LatestResults />
              </div>

              {/* Right side (1 column) */}
              <div className="lg:col-span-1">
                <Announcements />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
