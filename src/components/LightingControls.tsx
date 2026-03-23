import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DoorOpen, Moon, Sun, SunDim } from "lucide-react";

export type LightMode = "on" | "dim" | "off";

interface LightingControlsProps {
  mode: LightMode;
  onModeChange: (mode: LightMode) => void;
  exitLightsOn: boolean;
  onExitLightsChange: (isOn: boolean) => void;
}

const LightingControls = ({ mode, onModeChange, exitLightsOn, onExitLightsChange }: LightingControlsProps) => {
  const lights: { id: LightMode; label: string; icon: React.ReactNode }[] = [
    { id: "on", label: "Lights On", icon: <Sun className="w-4 h-4" /> },
    { id: "dim", label: "Lights Dim", icon: <SunDim className="w-4 h-4" /> },
    { id: "off", label: "Lights Off", icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">
          Exit Lights
        </span>
        <Button
          variant="light"
          size="sm"
          onClick={() => onExitLightsChange(true)}
          className={cn(
            "gap-1.5 text-xs",
            exitLightsOn && "ring-2 ring-red-500/50 bg-red-500/15 text-red-400"
          )}
        >
          <DoorOpen className="w-4 h-4" />
          Exit Lights On
        </Button>
        <Button
          variant="light"
          size="sm"
          onClick={() => onExitLightsChange(false)}
          className={cn(
            "gap-1.5 text-xs",
            !exitLightsOn && "ring-2 ring-border bg-secondary text-foreground"
          )}
        >
          <DoorOpen className="w-4 h-4" />
          Exit Lights Off
        </Button>
      </div>
    </div>
  );
};

export default LightingControls;
