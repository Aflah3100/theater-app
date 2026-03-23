import { type Dispatch, type SetStateAction, useState } from "react";
import { Clapperboard, Film, Megaphone, MonitorSpeaker, Play, Power } from "lucide-react";
import MovieUploader from "@/components/MovieUploader";
import LightingControls, { type LightMode } from "@/components/LightingControls";
import TheaterSeats from "@/components/TheaterSeats";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { SelectedMedia } from "@/types/media";

type PlaybackStage = "idle" | "launchingAd" | "launchingFirstHalf" | "intermission" | "launchingSecondHalf" | "finished";

const Index = () => {
  const [firstHalf, setFirstHalf] = useState<SelectedMedia | null>(null);
  const [secondHalf, setSecondHalf] = useState<SelectedMedia | null>(null);
  const [ad, setAd] = useState<SelectedMedia | null>(null);
  const [lightMode, setLightMode] = useState<LightMode>("on");
  const [playbackStage, setPlaybackStage] = useState<PlaybackStage>("idle");

  const ambientClass =
    lightMode === "on"
      ? "theater-ambient-on"
      : lightMode === "dim"
        ? "theater-ambient-dim"
        : "theater-ambient-off";

  const desktopReady = Boolean(window.desktop?.isElectron);
  const playbackBusy = playbackStage === "launchingAd" || playbackStage === "launchingFirstHalf" || playbackStage === "launchingSecondHalf";
  const secondHalfEnabled = playbackStage === "intermission";
  const showLocked = playbackStage === "finished";

  const playInVlc = async (media: SelectedMedia | null, stage: PlaybackStage, title: string) => {
    if (!media?.path) {
      toast.error(`Upload the ${title.toLowerCase()} first.`);
      return false;
    }

    if (!desktopReady || !window.desktop?.playInVlc) {
      toast.error("This workflow requires the Electron desktop app so playback can stay in VLC.");
      return false;
    }

    setPlaybackStage(stage);

    const result = await window.desktop.playInVlc({ path: media.path });

    if (!result.ok) {
      setPlaybackStage("idle");
      toast.error(result.error);
      return false;
    }

    return true;
  };

  const handlePlayAd = async () => {
    const ok = await playInVlc(ad, "launchingAd", "advertisement");
    if (!ok) return;

    setPlaybackStage("idle");
    toast.success("Advertisement playback finished in VLC.");
  };

  const handlePlayFirstHalf = async () => {
    const ok = await playInVlc(firstHalf, "launchingFirstHalf", "first half");
    if (!ok) return;

    setPlaybackStage("intermission");
    toast.success("First half complete. Intermission is ready.");
  };

  const handlePlaySecondHalf = async () => {
    if (!secondHalfEnabled) {
      toast.error("Second half stays locked until the first half finishes.");
      return;
    }

    const ok = await playInVlc(secondHalf, "launchingSecondHalf", "second half");
    if (!ok) return;

    setPlaybackStage("finished");
    toast.success("Second half complete.");
  };

  const clearMedia = (
    media: SelectedMedia | null,
    setter: Dispatch<SetStateAction<SelectedMedia | null>>,
    label: string,
  ) => {
    if (showLocked) return;

    setter(null);

    if (!playbackBusy) {
      if (label === "first half" || label === "second half") {
        setPlaybackStage("idle");
      }
    }

    toast.success(`${label} removed.`);
  };

  const closeScreen = async () => {
    if (window.desktop?.closeApp) {
      await window.desktop.closeApp();
      return;
    }

    window.close();
  };

  const statusTitle =
    playbackStage === "launchingAd"
      ? "Playing advertisement in VLC"
      : playbackStage === "launchingFirstHalf"
        ? "Playing first half in VLC"
        : playbackStage === "launchingSecondHalf"
          ? "Playing second half in VLC"
          : playbackStage === "intermission"
            ? "Movie Intermission"
            : playbackStage === "finished"
              ? "Close the screen"
              : "Screen is ready";

  const statusDescription =
    playbackStage === "launchingAd"
      ? "VLC is handling advertisement playback. Return here when the clip finishes."
      : playbackStage === "launchingFirstHalf"
        ? "The first half is now playing in VLC. When it ends, intermission will appear here."
        : playbackStage === "launchingSecondHalf"
          ? "The second half is now playing in VLC. The app will offer a close action when VLC finishes."
          : playbackStage === "intermission"
            ? "Please turn on lights. The second-half playback button is now enabled."
            : playbackStage === "finished"
              ? "The movie has ended. Close the application for the next show."
              : desktopReady
                ? "Upload media and launch playback in VLC."
                : "Run this project through Electron to keep playback in VLC.";

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
        <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Electron + VLC screening desk</p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 relative z-10 max-w-6xl mx-auto w-full gap-8">
        <section className="w-full grid gap-6 xl:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <Film className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Movie upload</h2>
                  <p className="text-sm text-muted-foreground">Upload the first and second half separately. The second half stays locked until intermission.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <MovieUploader
                  file={firstHalf}
                  onFileSelect={setFirstHalf}
                  onClear={() => clearMedia(firstHalf, setFirstHalf, "first half")}
                  disabled={showLocked}
                  title="Upload first half"
                  description="Select the opening part of the feature film."
                />
                <MovieUploader
                  file={secondHalf}
                  onFileSelect={setSecondHalf}
                  onClear={() => clearMedia(secondHalf, setSecondHalf, "second half")}
                  disabled={showLocked}
                  title="Upload second half"
                  description="Select the second part to be played after intermission."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gold" size="lg" className="gap-2" disabled={!firstHalf || playbackBusy || showLocked} onClick={handlePlayFirstHalf}>
                  <Play className="w-5 h-5" />
                  {playbackStage === "launchingFirstHalf" ? "Opening VLC..." : "Play First Half in VLC"}
                </Button>
                <Button variant="theater" size="lg" className="gap-2" disabled={!secondHalf || !secondHalfEnabled || playbackBusy || showLocked} onClick={handlePlaySecondHalf}>
                  <Play className="w-5 h-5" />
                  {playbackStage === "launchingSecondHalf" ? "Opening VLC..." : "Play Second Half in VLC"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Advertisement upload</h2>
                  <p className="text-sm text-muted-foreground">Upload a pre-show clip separately and launch it in VLC whenever the auditorium is ready.</p>
                </div>
              </div>
              <MovieUploader
                file={ad}
                onFileSelect={setAd}
                onClear={() => clearMedia(ad, setAd, "advertisement")}
                disabled={showLocked}
                title="Upload advertisement"
                description="Choose the ad reel or sponsor clip."
                emptyIcon="megaphone"
              />
              <Button variant="theater" size="lg" className="gap-2" disabled={!ad || playbackBusy || showLocked} onClick={handlePlayAd}>
                <Megaphone className="w-5 h-5" />
                {playbackStage === "launchingAd" ? "Opening VLC..." : "Play Advertisement in VLC"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 shadow-xl shadow-black/20 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Theater screen</h2>
                <p className="text-sm text-muted-foreground">{desktopReady ? "Electron bridge is active and VLC remains the playback engine." : "Electron bridge is not active."}</p>
              </div>
              <MonitorSpeaker className="w-5 h-5 text-gold mt-0.5" />
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 bg-black/80 flex items-center justify-center">
              {playbackStage === "intermission" ? (
                <div className="px-6 text-center space-y-4">
                  <h3 className="text-3xl font-semibold text-gold">Movie Intermission</h3>
                  <p className="text-lg text-foreground">Please turn on lights.</p>
                  <Button variant="gold" size="lg" onClick={handlePlaySecondHalf} disabled={!secondHalfEnabled || !secondHalf || playbackBusy || showLocked}>
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
                <div className="px-6 text-center space-y-3 max-w-md">
                  <h3 className="text-2xl font-semibold text-gold">{statusTitle}</h3>
                  <p className="text-sm text-muted-foreground">{statusDescription}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-background/60 border border-border/50 px-4 py-3 text-sm text-muted-foreground">
              {playbackStage === "intermission"
                ? "Intermission is active. House lights should be on before the second half resumes in VLC."
                : playbackStage === "finished"
                  ? "Second half complete. All controls are locked until the application is closed."
                  : "Use the screen, seating preview, and lighting controls here without needing to scroll further down."}
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <TheaterSeats />
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <LightingControls mode={lightMode} onModeChange={setLightMode} />
            </div>
          </div>
        </section>
      </main>

      <div className="h-8 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
};

export default Index;
