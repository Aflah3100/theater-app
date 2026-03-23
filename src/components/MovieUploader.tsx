import { useRef } from "react";
import { Check, CircleX, Film, FolderOpen, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SelectedMedia } from "@/types/media";

interface MovieUploaderProps {
  file: SelectedMedia | null;
  onFileSelect: (file: SelectedMedia) => void;
  onClear?: () => void;
  title?: string;
  description?: string;
  emptyIcon?: "film" | "megaphone";
}

const MovieUploader = ({
  file,
  onFileSelect,
  onClear,
  title = "Load Film Reel",
  description = "Choose a movie file from your desktop library.",
  emptyIcon = "film",
}: MovieUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    onFileSelect({
      name: selected.name,
      path: (selected as File & { path?: string }).path,
      sizeLabel: `${(selected.size / (1024 * 1024)).toFixed(1)} MB`,
      source: URL.createObjectURL(selected),
    });

    e.target.value = "";
  };

  const handlePick = async () => {
    if (window.desktop?.isElectron) {
      const selected = await window.desktop.selectVideo();
      if (!selected) return;
      onFileSelect(selected);
      return;
    }

    inputRef.current?.click();
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClear?.();
  };

  const EmptyIcon = emptyIcon === "megaphone" ? Megaphone : Film;

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
        file ? "border-gold/50 bg-gold/5" : "border-border hover:border-gold/30 hover:bg-secondary/50",
      )}
      onClick={handlePick}
    >
      <input ref={inputRef} type="file" accept="video/*,.mkv" className="hidden" onChange={handleFileInput} />
      {file && onClear ? (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="absolute right-4 top-4 h-9 w-9 rounded-full border-gold/40 bg-background/80 text-gold hover:bg-gold/10"
          onClick={handleClear}
          aria-label={`Eject ${title}`}
        >
          <CircleX className="h-4 w-4" />
        </Button>
      ) : null}
      <div className="flex flex-col items-center gap-3">
        {file ? (
          <>
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {file.sizeLabel ?? "Ready for playback"} — Click to change
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <EmptyIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground border border-border/60">
              <FolderOpen className="w-3.5 h-3.5" />
              Choose file
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieUploader;
