export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center space-x-3">
      <div
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#8B0000] to-[#B11226] shadow-lg shadow-[#B11226]/50"
        style={{ width: size, height: size }}
      >
        <span
          className="font-bold text-white"
          style={{ fontSize: size * 0.5 }}
        >
          S
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white tracking-tight">
          SplitChain
        </span>
        <span className="text-xs text-[#B3B3B3] -mt-1">
          Trustless. Transparent. Instant.
        </span>
      </div>
    </div>
  );
}
