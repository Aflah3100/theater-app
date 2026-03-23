import { cn } from "@/lib/utils";
import type { LightMode } from "@/components/LightingControls";

const SeatRow = ({ count, scale, opacity }: { count: number; scale: number; opacity: number }) => (
  <div
    className="flex justify-center gap-1 sm:gap-1.5"
    style={{ transform: `scale(${scale})`, opacity }}
  >
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="w-5 h-4 sm:w-6 sm:h-5 rounded-t-lg bg-curtain-dark border border-curtain/30"
        style={{
          boxShadow: 'inset 0 -2px 4px hsl(0 0% 0% / 0.3)',
        }}
      />
    ))}
  </div>
);

const ExitLight = ({ active }: { active: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={cn(
        "h-28 w-8 rounded-full border transition-all duration-500",
        active
          ? "border-red-400/80 bg-gradient-to-b from-red-400/80 via-red-500/45 to-red-950/20 shadow-[0_0_24px_rgba(248,113,113,0.55)]"
          : "border-border/60 bg-background/40"
      )}
    />
    <div
      className={cn(
        "rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-500",
        active
          ? "border-red-400/70 bg-red-500/20 text-red-300 shadow-[0_0_18px_rgba(248,113,113,0.35)]"
          : "border-border/60 bg-background/70 text-muted-foreground"
      )}
    >
      Exit
    </div>
  </div>
);

const TheaterSeats = ({
  exitLightsOn = false,
  lightMode = "on",
}: {
  exitLightsOn?: boolean;
  lightMode?: LightMode;
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between px-6 sm:px-10">
        {[0, 1, 2].map((light) => (
          <div
            key={light}
            className={cn(
              "h-3 w-3 rounded-full border transition-all duration-500",
              lightMode === "on"
                ? "border-yellow-200/90 bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.75)]"
                : lightMode === "dim"
                  ? "border-yellow-100/45 bg-yellow-200/50 shadow-[0_0_10px_rgba(253,224,71,0.3)]"
                  : "border-border/40 bg-transparent shadow-none"
            )}
          />
        ))}
      </div>
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        <ExitLight active={exitLightsOn} />
        <div className="space-y-1.5 sm:space-y-2">
          <SeatRow count={9} scale={0.85} opacity={0.7} />
          <SeatRow count={11} scale={0.9} opacity={0.6} />
          <SeatRow count={13} scale={0.95} opacity={0.5} />
          <SeatRow count={15} scale={1} opacity={0.4} />
        </div>
        <ExitLight active={exitLightsOn} />
      </div>
    </div>
  );
};

export default TheaterSeats;
