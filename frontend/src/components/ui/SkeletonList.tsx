type Props = {
  rows?: number;
};

export default function SkeletonList({ rows = 4 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-[#E8E5DF] bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-40 rounded-full bg-[#E8E5DF]" />
              <div className="h-3 w-24 rounded-full bg-[#F0EDE8]" />
            </div>
            <div className="h-7 w-20 rounded-full bg-[#E8E5DF]" />
          </div>
        </div>
      ))}
    </div>
  );
}
