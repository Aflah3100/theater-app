import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface IntermissionTimerProps {
  value: string;
  onChange: (value: string) => void;
}

const IntermissionTimer = ({ value, onChange }: IntermissionTimerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > 6) raw = raw.slice(0, 6);
    
    let formatted = "";
    if (raw.length > 4) {
      formatted = `${raw.slice(0, raw.length - 4)}:${raw.slice(raw.length - 4, raw.length - 2)}:${raw.slice(raw.length - 2)}`;
    } else if (raw.length > 2) {
      formatted = `${raw.slice(0, raw.length - 2)}:${raw.slice(raw.length - 2)}`;
    } else {
      formatted = raw;
    }
    
    onChange(formatted);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        Intermission At
      </label>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="HH:MM:SS"
        className="w-36 text-center font-mono text-sm bg-secondary/50 border-border focus:border-gold/50 focus:ring-gold/20"
      />
      <p className="text-[10px] text-muted-foreground">
        Leave empty for no intermission
      </p>
    </div>
  );
};

export function parseTimerToSeconds(timer: string): number | null {
  if (!timer.trim()) return null;
  const parts = timer.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return null;
}

export default IntermissionTimer;
