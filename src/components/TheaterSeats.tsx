const SeatRow = ({ count, scale, opacity }: { count: number; scale: number; opacity: number }) => (
  <div
    className="flex justify-center gap-1 sm:gap-1.5"
    style={{ transform: `scale(${scale})`, opacity }}
  >
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="w-5 h-4 sm:w-6 sm:h-5 rounded-t-lg bg-curtain-dark border border-curtain/30"
        style={{
          boxShadow: 'inset 0 -2px 4px hsl(0 0% 0% / 0.3)',
        }}
      />
    ))}
  </div>
);

const TheaterSeats = () => {
  return (
    <div className="mt-6 space-y-1.5 sm:space-y-2">
      <SeatRow count={9} scale={0.85} opacity={0.7} />
      <SeatRow count={11} scale={0.9} opacity={0.6} />
      <SeatRow count={13} scale={0.95} opacity={0.5} />
      <SeatRow count={15} scale={1} opacity={0.4} />
    </div>
  );
};

export default TheaterSeats;
