import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Clapperboard, Megaphone, Play, MonitorSpeaker, Video, Languages, Captions, Film, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieUploader from "@/components/MovieUploader";
import LightingControls, { type LightMode } from "@/components/LightingControls";
import TheaterSeats from "@/components/TheaterSeats";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { SelectedMedia } from "@/types/media";

type PlaybackStage = "idle" | "ad" | "firstHalf" | "intermission" | "secondHalf" | "finished";

const getMediaSource = (media: SelectedMedia | null) => {
  if (!media) return "";
  if (media.source) return media.source;
  if (media.path) return `file://${encodeURI(media.path.replace(/\\/g, "/"))}`;
  return "";
};

const Index = () => {
  const [firstHalf, setFirstHalf] = useState<SelectedMedia | null>(null);
  const [secondHalf, setSecondHalf] = useState<SelectedMedia | null>(null);
  const [ad, setAd] = useState<SelectedMedia | null>(null);
  const [lightMode, setLightMode] = useState<LightMode>("on");
  const [playbackStage, setPlaybackStage] = useState<PlaybackStage>("idle");
  const [currentSource, setCurrentSource] = useState("");
  const [currentTitle, setCurrentTitle] = useState("Screen is ready");
  const videoRef = useRef<HTMLVideoElement>(null);

  const ambientClass =
    lightMode === "on"
      ? "theater-ambient-on"
      : lightMode === "dim"
        ? "theater-ambient-dim"
        : "theater-ambient-off";

  const desktopReady = Boolean(window.desktop?.isElectron);
  const secondHalfEnabled = playbackStage === "intermission";

  const featureHighlights = useMemo(
    () => [
      {
        icon: Languages,
        title: "Split feature playback",
        description: "Load two movie files so the second half stays locked until intermission begins.",
      },
      {
        icon: Captions,
        title: "Intermission workflow",
        description: "When the first half ends, the screen prompts staff to turn on lights before resuming.",
      },
      {
        icon: Video,
        title: "One-click finish",
        description: "After the second half ends, the app offers a close-screen action for a clean shutdown.",
      },
    ],
    [],
  );

  useEffect(() => {
    return () => {
      [firstHalf, secondHalf, ad].forEach((media) => {
        if (media?.source?.startsWith("blob:")) {
          URL.revokeObjectURL(media.source);
        }
      });
    };
    // We revoke current blob URLs only when the page unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceMedia = (
    nextMedia: SelectedMedia | null,
    setter: Dispatch<SetStateAction<SelectedMedia | null>>,
    previous: SelectedMedia | null,
  ) => {
    if (previous?.source?.startsWith("blob:")) {
      URL.revokeObjectURL(previous.source);
    }
    setter(nextMedia);
  };

  const clearMedia = (
    media: SelectedMedia | null,
    setter: Dispatch<SetStateAction<SelectedMedia | null>>,
    label: string,
  ) => {
    if (media?.source?.startsWith("blob:")) {
      URL.revokeObjectURL(media.source);
    }

    if (
      (playbackStage === "ad" && label === "advertisement") ||
      ((playbackStage === "firstHalf" || playbackStage === "secondHalf") && currentSource === getMediaSource(media))
    ) {
      setPlaybackStage("idle");
      setCurrentSource("");
      setCurrentTitle("Screen is ready");
      videoRef.current?.pause();
    }

    setter(null);
    toast.success(`${label} removed.`);
  };

  const beginPlayback = (media: SelectedMedia | null, stage: PlaybackStage, title: string) => {
    const source = getMediaSource(media);
    if (!source) {
      toast.error(`Upload the ${title.toLowerCase()} first.`);
      return;
    }

    setCurrentSource(source);
    setCurrentTitle(title);
    setPlaybackStage(stage);
    setLightMode("off");
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {
        toast.error("Playback could not start automatically. Please press play on the screen.");
      });
    });
  };

  const handlePlayAd = () => beginPlayback(ad, "ad", "Advertisement");
  const handlePlayFirstHalf = () => beginPlayback(firstHalf, "firstHalf", "Movie – First Half");
  const handlePlaySecondHalf = () => {
    if (!secondHalfEnabled) {
      toast.error("Second half stays locked until the first half finishes.");
      return;
    }

    beginPlayback(secondHalf, "secondHalf", "Movie – Second Half");
  };

  const handleVideoEnded = () => {
    if (playbackStage === "ad") {
      setPlaybackStage("idle");
      setCurrentSource("");
      setCurrentTitle("Screen is ready");
      setLightMode("dim");
      return;
    }

    if (playbackStage === "firstHalf") {
      setPlaybackStage("intermission");
      setCurrentSource("");
      setCurrentTitle("Intermission");
      setLightMode("on");
      return;
    }

    if (playbackStage === "secondHalf") {
      setPlaybackStage("finished");
      setCurrentSource("");
      setCurrentTitle("Show complete");
      setLightMode("on");
    }
  };

  const closeScreen = async () => {
    if (window.desktop?.closeApp) {
      await window.desktop.closeApp();
      return;
    }

    window.close();
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

      <header className="text-center pt-6 pb-4 px-4 relative z-10" style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
        <div className="flex items-center justify-center gap-3 mb-1">
          <Clapperboard className="w-6 h-6 text-gold" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">Cinema Hall</h1>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Electron theater playback desk</p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 relative z-10 max-w-6xl mx-auto w-full gap-8">
        <section className="w-full grid gap-6 xl:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <Film className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Movie upload</h2>
                  <p className="text-sm text-muted-foreground">Upload both halves of the feature. The second half unlocks only after intermission.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <MovieUploader file={firstHalf} onFileSelect={(media) => replaceMedia(media, setFirstHalf, firstHalf)} onClear={() => clearMedia(firstHalf, setFirstHalf, "first half")} title="Upload first half" description="Select the opening part of the feature film." />
                <MovieUploader file={secondHalf} onFileSelect={(media) => replaceMedia(media, setSecondHalf, secondHalf)} onClear={() => clearMedia(secondHalf, setSecondHalf, "second half")} title="Upload second half" description="Select the second part to be played after intermission." />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gold" size="lg" className="gap-2" disabled={!firstHalf || playbackStage === "firstHalf" || playbackStage === "secondHalf"} onClick={handlePlayFirstHalf}>
                  <Play className="w-5 h-5" />
                  {playbackStage === "firstHalf" ? "Playing first half..." : "Play First Half"}
                </Button>
                <Button variant="theater" size="lg" className="gap-2" disabled={!secondHalf || !secondHalfEnabled || playbackStage === "secondHalf"} onClick={handlePlaySecondHalf}>
                  <Play className="w-5 h-5" />
                  {playbackStage === "secondHalf" ? "Playing second half..." : "Play Second Half"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Advertisement upload</h2>
                  <p className="text-sm text-muted-foreground">Upload a pre-show advertisement separately so it can be played before the feature starts.</p>
                </div>
              </div>
              <MovieUploader file={ad} onFileSelect={(media) => replaceMedia(media, setAd, ad)} onClear={() => clearMedia(ad, setAd, "advertisement")} title="Upload advertisement" description="Choose the ad reel or sponsor clip." emptyIcon="megaphone" />
              <Button variant="theater" size="lg" className="gap-2" disabled={!ad || playbackStage === "firstHalf" || playbackStage === "secondHalf"} onClick={handlePlayAd}>
                <Megaphone className="w-5 h-5" />
                {playbackStage === "ad" ? "Playing advertisement..." : "Play Advertisement"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 shadow-xl shadow-black/20 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Theater screen</h2>
                <p className="text-sm text-muted-foreground">{desktopReady ? "Electron playback is active." : "Browser preview mode is active."}</p>
              </div>
              <MonitorSpeaker className="w-5 h-5 text-gold mt-0.5" />
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 bg-black/80 flex items-center justify-center">
              {currentSource ? (
                <video ref={videoRef} key={currentSource} src={currentSource} controls autoPlay className="h-full w-full bg-black" onEnded={handleVideoEnded} />
              ) : playbackStage === "intermission" ? (
                <div className="px-6 text-center space-y-4">
                  <h3 className="text-3xl font-semibold text-gold">Movie Intermission</h3>
                  <p className="text-lg text-foreground">Please turn on lights.</p>
                  <Button variant="gold" size="lg" onClick={handlePlaySecondHalf} disabled={!secondHalfEnabled || !secondHalf}>
                    Play Second Half
                  </Button>
                </div>
              ) : playbackStage === "finished" ? (
                <div className="px-6 text-center space-y-4">
                  <h3 className="text-3xl font-semibold text-gold">Close the screen</h3>
                  <p className="text-lg text-foreground">The movie has ended. Close the application for the next show.</p>
                  <Button variant="destructive" size="lg" className="gap-2" onClick={closeScreen}>
                    <Power className="w-5 h-5" />
                    Close Application
                  </Button>
                </div>
              ) : (
                <div className="px-6 text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-gold">{currentTitle}</h3>
                  <p className="text-sm text-muted-foreground">Upload a movie half or advertisement, then start playback from the appropriate section.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-background/60 border border-border/50 px-4 py-3 text-sm text-muted-foreground">
              {playbackStage === "intermission"
                ? "Intermission is active. House lights should be on before the second half resumes."
                : playbackStage === "finished"
                  ? "Second half complete. Use the close action above to shut the screen down."
                  : "Use the controls on the left to manage movie halves, advertisements, and removable uploads."}
            </div>

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
