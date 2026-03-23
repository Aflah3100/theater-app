import { useRef, useState, useEffect } from "react";
import TheaterCurtains from "./TheaterCurtains";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface TheaterScreenProps {
  videoUrl: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  curtainsOpen: boolean;
  intermissionAt?: number;
  onIntermission?: () => void;
  resumeFrom?: number;
  onPauseAtIntermission?: (time: number) => void;
}

const TheaterScreen = ({
  videoUrl,
  isPlaying,
  onPlayPause,
  onEnded,
  curtainsOpen,
  intermissionAt,
  onIntermission,
  resumeFrom = 0,
  onPauseAtIntermission,
}: TheaterScreenProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const intermissionFired = useRef(false);

  // Set start time when video loads
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoUrl) return;
    const handleLoaded = () => {
      if (resumeFrom > 0) {
        v.currentTime = resumeFrom;
      }
    };
    v.addEventListener("loadedmetadata", handleLoaded);
    return () => v.removeEventListener("loadedmetadata", handleLoaded);
  }, [videoUrl, resumeFrom]);

  useEffect(() => {
    intermissionFired.current = false;
  }, [videoUrl, intermissionAt]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    setProgress((v.currentTime / v.duration) * 100 || 0);
    setCurrentTime(formatTime(v.currentTime));
    setDuration(formatTime(v.duration));

    // Check intermission
    if (
      intermissionAt &&
      !intermissionFired.current &&
      v.currentTime >= intermissionAt
    ) {
      intermissionFired.current = true;
      onPauseAtIntermission?.(v.currentTime);
      onIntermission?.();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border-4 border-curtain-dark"
      style={{
        boxShadow: curtainsOpen && isPlaying
          ? '0 0 80px hsl(210, 30%, 15%, 0.6), 0 0 160px hsl(210, 30%, 15%, 0.3)'
          : '0 0 40px hsl(0, 0%, 0%, 0.5)',
      }}
    >
      <TheaterCurtains isOpen={curtainsOpen} />

      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-contain z-10"
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          onClick={onPlayPause}
        />
      ) : (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-muted-foreground text-sm font-display">Upload a movie to begin</p>
        </div>
      )}

      {videoUrl && curtainsOpen && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div
            className="w-full h-1.5 bg-secondary/40 rounded-full cursor-pointer mb-3 group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gold rounded-full relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onPlayPause}
                className="text-foreground hover:text-gold transition-colors active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="text-foreground hover:text-gold transition-colors active:scale-95"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentTime} / {duration}
              </span>
            </div>
            <button
              onClick={handleFullscreen}
              className="text-foreground hover:text-gold transition-colors active:scale-95"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterScreen;
