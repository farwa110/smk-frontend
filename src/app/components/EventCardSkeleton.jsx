// EventCardSkeleton.jsx
export default function EventCardSkeleton() {
  return (
    <div className="p-4 bg-white/80 flex-grow h-full w-full max-w-[700px] min-w-[250px] flex-shrink-0 overflow-hidden shadow block mb-4">
      <div className="w-full mx-auto p-4 sm:p-6 md:p-8 border border-my-bluedark/20 bg-gradient-to-br from-white/70 to-my-bluelight/40 shadow-md backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-60">
          {/* Image skeleton */}
          <div className="w-full md:w-60 h-48 md:h-full bg-my-blue/10 rounded animate-pulse flex-shrink-0" />

          {/* Text skeleton */}
          <div className="flex flex-col justify-between flex-1">
            <div className="space-y-3">
              {/* Title */}
              <div className="h-7 w-3/4 bg-my-blue/10 rounded animate-pulse mt-2" />
              {/* Description lines */}
              <div className="h-4 w-full bg-my-blue/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-my-blue/10 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-my-blue/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2 mt-4">
              {/* Date */}
              <div className="h-3.5 w-1/3 bg-my-blue/10 rounded animate-pulse" />
              {/* Location */}
              <div className="h-3.5 w-1/2 bg-my-blue/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="mt-6 pt-4 border-t border-my-orangedark/20 flex justify-end">
          <div className="h-10 w-28 bg-my-blue/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
