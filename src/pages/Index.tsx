import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import TheaterSeats from "@/components/TheaterSeats";
import LightingControls, { type LightMode } from "@/components/LightingControls";
import MovieUploader from "@/components/MovieUploader";
import { cn } from "@/lib/utils";
import { Clapperboard, Megaphone, Play, MonitorSpeaker, Video, Languages, Captions } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import type { SelectedMedia } from "@/types/media";

const Index = () => {
  const [movie, setMovie] = useState<SelectedMedia | null>(null);
  const [ad, setAd] = useState<SelectedMedia | null>(null);
  const [lightMode, setLightMode] = useState<LightMode>("on");
  const [launching, setLaunching] = useState<"movie" | "ad" | null>(null);

  const ambientClass =
    lightMode === "on"
      ? "theater-ambient-on"
      : lightMode === "dim"
        ? "theater-ambient-dim"
        : "theater-ambient-off";

  const desktopReady = Boolean(window.desktop?.isElectron);

  const featureHighlights = useMemo(
    () => [
      {
        icon: Languages,
        title: "Audio Tracks",
        description: "Use VLC's built-in menus to switch available audio streams.",
      },
      {
        icon: Captions,
        title: "Subtitles",
        description: "Enable embedded or external subtitles directly inside VLC.",
      },
      {
        icon: Video,
        title: "Video Controls",
        description: "Access aspect ratio, playback speed, filters, and device options.",
      },
    ],
    [],
  );

  const openInVlc = async (media: SelectedMedia | null, kind: "movie" | "ad") => {
    if (!media) {
      toast.error(`Select a ${kind} file first.`);
      return;
    }

    if (!desktopReady || !media.path) {
      toast.error("Desktop VLC launching is only available from the Electron app.");
      return;
    }

    setLaunching(kind);
    const result = await window.desktop.playInVlc({ path: media.path });
    setLaunching(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(`${kind === "movie" ? "Movie" : "Ad"} opened in VLC.`);
    setLightMode("off");
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-1000 flex flex-col", ambientClass)}>
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-1000"
        style={{
          background:
            lightMode === "on"
              ? "linear-gradient(90deg, transparent, hsl(42, 70%, 50%, 0.4), transparent)"
              : lightMode === "dim"
                ? "linear-gradient(90deg, transparent, hsl(42, 70%, 50%, 0.15), transparent)"
                : "transparent",
        }}
      />

      {["left", "right"].map((side) => (
        <div
          key={side}
          className="fixed top-1/3 z-40 transition-all duration-1000"
          style={{
            [side]: "16px",
            width: "4px",
            height: "60px",
            borderRadius: "2px",
            background:
              lightMode === "on"
                ? "hsl(42, 70%, 50%, 0.6)"
                : lightMode === "dim"
                  ? "hsl(42, 70%, 50%, 0.2)"
                  : "hsl(42, 70%, 50%, 0.03)",
            boxShadow:
              lightMode === "on"
                ? "0 0 30px hsl(42, 70%, 50%, 0.3)"
                : lightMode === "dim"
                  ? "0 0 15px hsl(42, 70%, 50%, 0.1)"
                  : "none",
          }}
        />
      ))}

      <header
        className="text-center pt-6 pb-4 px-4 relative z-10"
        style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <Clapperboard className="w-6 h-6 text-gold" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">Cinema Hall</h1>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Electron + VLC screening desk</p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 relative z-10 max-w-5xl mx-auto w-full gap-8">
        <section className="w-full grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-6">
            <MovieUploader file={movie} onFileSelect={setMovie} title="Load Feature Film" />
            <MovieUploader
              file={ad}
              onFileSelect={setAd}
              title="Load Advertisement"
              description="Choose a pre-show ad clip and launch it in VLC."
              emptyIcon="megaphone"
            />

            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <MonitorSpeaker className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Launch in VLC</h2>
                  <p className="text-sm text-muted-foreground">
                    Files open in the system VLC player so you can access audio tracks, subtitle menus, playback speed,
                    aspect ratio, filters, and the rest of VLC's native controls.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="theater" size="lg" className="gap-2" disabled={!ad || launching !== null} onClick={() => openInVlc(ad, "ad")}>
                  <Megaphone className="w-5 h-5" />
                  {launching === "ad" ? "Opening Ad..." : "Play Ad in VLC"}
                </Button>
                <Button variant="gold" size="lg" className="gap-2" disabled={!movie || launching !== null} onClick={() => openInVlc(movie, "movie")}>
                  <Play className="w-5 h-5" />
                  {launching === "movie" ? "Opening Movie..." : "Play Movie in VLC"}
                </Button>
              </div>

              <div className="rounded-xl bg-background/60 border border-border/50 px-4 py-3 text-sm text-muted-foreground">
                {desktopReady
                  ? "Desktop bridge is active. If VLC is installed, the selected file will open in fullscreen mode."
                  : "Desktop bridge is not active. Run this project through Electron to launch VLC from the theater UI."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 shadow-xl shadow-black/20 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Why use VLC here?</h2>
            <p className="text-sm text-muted-foreground">
              VLC is handling the actual media playback, which makes this desktop version a better fit for complex local
              media libraries than an in-browser video tag.
            </p>
            <div className="space-y-3">
              {featureHighlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-xl border border-border/50 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-0.5 text-gold" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TheaterSeats />

        <div className="mt-2" style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}>
          <LightingControls mode={lightMode} onModeChange={setLightMode} />
        </div>
      </main>

      <div className="h-8 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
};

export default Index;
