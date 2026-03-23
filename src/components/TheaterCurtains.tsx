import { cn } from "@/lib/utils";

interface TheaterCurtainsProps {
  isOpen: boolean;
}

const CurtainFold = ({ side }: { side: "left" | "right" }) => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "absolute top-0 bottom-0 w-[14%]",
          side === "left" ? "border-r" : "border-l",
          "border-curtain-dark/40"
        )}
        style={{
          [side]: `${i * 13}%`,
          background: `linear-gradient(${side === "left" ? "to right" : "to left"}, 
            hsl(0 60% 12% / ${0.3 + i * 0.05}), 
            transparent)`,
        }}
      />
    ))}
  </div>
);

const TheaterCurtains = ({ isOpen }: TheaterCurtainsProps) => {
  return (
    <>
      {/* Top valance */}
      <div className="absolute top-0 left-0 right-0 h-12 z-30 bg-gradient-to-b from-curtain-dark to-curtain/80"
        style={{
          borderBottom: '3px solid hsl(42 70% 50% / 0.3)',
          boxShadow: '0 4px 20px hsl(0 0% 0% / 0.5)',
        }}
      >
        <div className="absolute inset-0 flex">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 relative">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-8 rounded-b-[50%] bg-curtain-dark/60"
                style={{ borderBottom: '2px solid hsl(42 70% 50% / 0.15)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left curtain */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 z-20 bg-curtain"
        style={{
          animation: isOpen
            ? 'curtain-open-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            : 'curtain-close-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          background: 'linear-gradient(to right, hsl(0 70% 22%), hsl(0 65% 28%), hsl(0 60% 20%))',
        }}
      >
        <CurtainFold side="left" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
      </div>

      {/* Right curtain */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 z-20 bg-curtain"
        style={{
          animation: isOpen
            ? 'curtain-open-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            : 'curtain-close-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          background: 'linear-gradient(to left, hsl(0 70% 22%), hsl(0 65% 28%), hsl(0 60% 20%))',
        }}
      >
        <CurtainFold side="right" />
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
      </div>
    </>
  );
};

export default TheaterCurtains;
