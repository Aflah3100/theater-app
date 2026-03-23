import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import TheaterSeats from "@/components/TheaterSeats";
import LightingControls, { type LightMode } from "@/components/LightingControls";
import MovieUploader from "@/components/MovieUploader";
import { cn } from "@/lib/utils";
import { Play, SkipForward, RotateCcw, Clapperboard, Megaphone } from "lucide-react";

type ShowState = "lobby" | "playing-first" | "intermission" | "playing-second" | "playing-ad" | "ended";

const Index = () => {
  const [movie, setMovie] = useState<File | null>(null);
  const [ad, setAd] = useState<File | null>(null);
  const [intermissionTime, setIntermissionTime] = useState("");
  const [showState, setShowState] = useState<ShowState>("lobby");
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

  const movieUrl = useMemo(() => (movie ? URL.createObjectURL(movie) : null), [movie]);
  const adUrl = useMemo(() => (ad ? URL.createObjectURL(ad) : null), [ad]);

    if (!desktopReady || !media.path) {
      toast.error("Desktop VLC launching is only available from the Electron app.");
      return;
    }

  const curtainsOpen =
    showState === "playing-first" || showState === "playing-second" || showState === "playing-ad";
  const activeVideoUrl = showState === "playing-ad" ? adUrl : movieUrl;

  const startPlayback = (nextState: ShowState) => {
    setShowState(nextState);
    setLightMode("off");
    setTimeout(() => setIsPlaying(true), 1600);
  };

  const handleStartShow = () => {
    if (!movie) return;
    setResumeFrom(0);
    if (intermissionSeconds && intermissionSeconds > 0) {
      startPlayback("playing-first");
    } else {
      startPlayback("playing-second");
    }
  };

  const handlePlayAd = () => {
    if (!ad) return;
    setResumeFrom(0);
    startPlayback("playing-ad");
  };

  const handleIntermissionTrigger = () => {
    setIsPlaying(false);
    setLightMode("dim");
    setTimeout(() => setShowState("intermission"), 500);
  };

  const handleStartSecondHalf = () => {
    startPlayback("playing-second");
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setLightMode("on");
    if (showState === "playing-ad") {
      setShowState("lobby");
      return;
    }
    setShowState("ended");
  };

  const handleReset = () => {
    setShowState("lobby");
    setLightMode("on");
    setIsPlaying(false);
    setResumeFrom(0);
  };

  const ambientClass =
    lightMode === "on"
      ? "theater-ambient-on"
      : lightMode === "dim"
        ? "theater-ambient-dim"
        : "theater-ambient-off";

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
          <h1
            className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight"
            style={{ lineHeight: "1.1" }}
          >
            Cinema Hall
          </h1>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Private Screening Room</p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 relative z-10 max-w-5xl mx-auto w-full">
        {showState === "lobby" && (
          <div
            className="w-full space-y-6 max-w-md mx-auto"
            style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
          >
            <MovieUploader file={movie} onFileSelect={setMovie} />
            <MovieUploader
              file={ad}
              onFileSelect={setAd}
              title="Load Advertisement"
              description="Click to upload • Play a pre-show ad clip"
              emptyIcon="megaphone"
            />

            {(movie || ad) && (
              <div
                className="space-y-6"
                style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
              >
                {movie && <IntermissionTimer value={intermissionTime} onChange={setIntermissionTime} />}

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  {ad && (
                    <Button variant="theater" size="lg" onClick={handlePlayAd} className="gap-2">
                      <Megaphone className="w-5 h-5" />
                      Play Ad
                    </Button>
                  )}
                  {movie && (
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={handleStartShow}
                      className="gap-2 animate-pulse-glow"
                    >
                      <Play className="w-5 h-5" />
                      Begin Screening
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {showState === "intermission" && (
          <div
            className="w-full flex flex-col items-center justify-center py-16 space-y-8"
            style={{ animation: "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="text-center space-y-3">
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-gold" style={{ lineHeight: "1.05" }}>
                Intermission
              </h2>
              <p className="text-muted-foreground text-sm">The show will resume shortly. Grab your popcorn! 🍿</p>
            </div>
          </div>
        )}

        {showState === "ended" && (
          <div
            className="w-full flex flex-col items-center justify-center py-16 space-y-8"
            style={{ animation: "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="text-center space-y-3">
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-gold" style={{ lineHeight: "1.05" }}>
                The End
              </h2>
              <p className="text-muted-foreground text-sm">Thank you for watching! We hope you enjoyed the show.</p>
            </div>
            <Button variant="theater" size="lg" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Screening
            </Button>
          </div>
        )}

        {(showState === "playing-first" || showState === "playing-second" || showState === "playing-ad") && (
          <div className="w-full" style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            <TheaterScreen
              videoUrl={activeVideoUrl}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onEnded={handleVideoEnd}
              curtainsOpen={curtainsOpen}
              intermissionAt={showState === "playing-first" ? intermissionSeconds ?? undefined : undefined}
              onIntermission={handleIntermissionTrigger}
              resumeFrom={resumeFrom}
              onPauseAtIntermission={(time) => setResumeFrom(time)}
            />
          </div>
        </section>

        <TheaterSeats />

        <div className="mt-8" style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}>
          <LightingControls mode={lightMode} onModeChange={setLightMode} />
        </div>
      </main>

      <div className="h-8 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
};

export default Index;
