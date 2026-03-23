import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, SunDim, Moon } from "lucide-react";

export type LightMode = "on" | "dim" | "off";

interface LightingControlsProps {
  mode: LightMode;
  onModeChange: (mode: LightMode) => void;
}

const LightingControls = ({ mode, onModeChange }: LightingControlsProps) => {
  const lights: { id: LightMode; label: string; icon: React.ReactNode }[] = [
    { id: "on", label: "Lights On", icon: <Sun className="w-4 h-4" /> },
    { id: "dim", label: "Lights Dim", icon: <SunDim className="w-4 h-4" /> },
    { id: "off", label: "Lights Off", icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">
        Theater Lights
      </span>
      {lights.map((light) => (
        <Button
          key={light.id}
          variant="light"
          size="sm"
          onClick={() => onModeChange(light.id)}
          className={cn(
            "gap-1.5 text-xs",
            mode === light.id && "ring-2 ring-gold/50 bg-gold/10 text-gold"
          )}
        >
          {light.icon}
          {light.label}
        </Button>
      ))}
    </div>
  );
};

export default LightingControls;
