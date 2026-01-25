import hero from "../../assets/hero.png";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative">
      {/* background image */}
      <div
        className="h-[320px] sm:h-[440px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* content */}
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <p className="text-lg sm:text-2xl font-extrabold uppercase tracking-wide text-white">
            Welcome to
          </p>

          <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl md:text-6xl font-black uppercase">
            <span className="text-white">Apex</span>{" "}
            <span className="text-yellow-400">Sports</span>
          </h1>

          <p className="mt-2 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-base text-white/80 px-4">
            Live scoring • Schedules • Teams • Results • Announcements
          </p>

          {/* CTA Buttons */}
          <div className="mt-5 sm:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto px-4 sm:px-0">
            <Button to="/schedule" variant="primary">
              View Schedule
            </Button>

            <Button to="/scores" variant="warning">
              Latest Results
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
