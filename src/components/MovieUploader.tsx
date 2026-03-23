import { useRef } from "react";
import { Film, Check, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  title?: string;
  description?: string;
  emptyIcon?: "film" | "megaphone";
}

const MovieUploader = ({
  file,
  onFileSelect,
  title = "Load Film Reel",
  description = "Click to upload • MKV, MP4, AVI, etc.",
  emptyIcon = "film",
}: MovieUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  const EmptyIcon = emptyIcon === "megaphone" ? Megaphone : Film;

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
        file ? "border-gold/50 bg-gold/5" : "border-border hover:border-gold/30 hover:bg-secondary/50",
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="video/*,.mkv" className="hidden" onChange={handleChange} />
      <div className="flex flex-col items-center gap-3">
        {file ? (
          <>
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / (1024 * 1024)).toFixed(1)} MB — Click to change
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
          </>
        )}
      </div>
    </div>
  );
};

export default MovieUploader;
