export default function Loading() {
  return (
    <main className="min-h-[70vh] w-full py-10 md:py-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="w-full rounded-2xl border border-my-bluelight/40 bg-my-white shadow-sm p-6 sm:p-8 md:p-10 animate-pulse">
          {/* top label */}
          <div className="h-4 w-28 rounded-full bg-my-bluelight mb-6" />

          {/* title */}
          <div className="space-y-3 mb-8">
            <div className="h-10 sm:h-12 w-3/4 rounded-lg bg-gradient-to-r from-my-bluelight via-white to-my-bluelight" />
            <div className="h-5 w-1/2 rounded bg-my-graylight" />
          </div>

          {/* big hero block */}
          <div className="w-full h-[220px] sm:h-[280px] lg:h-[340px] rounded-2xl bg-gradient-to-r from-my-bluelight via-white to-my-bluelight mb-8" />

          {/* content rows */}
          <div className="space-y-4 mb-8">
            <div className="h-4 w-full rounded bg-my-graylight" />
            <div className="h-4 w-11/12 rounded bg-my-graylight" />
            <div className="h-4 w-8/12 rounded bg-my-graylight" />
          </div>

          {/* bottom blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 rounded-xl bg-gradient-to-r from-my-bluelight via-white to-my-bluelight" />
            <div className="h-28 rounded-xl bg-gradient-to-r from-my-bluelight via-white to-my-bluelight" />
            <div className="h-28 rounded-xl bg-gradient-to-r from-my-bluelight via-white to-my-bluelight" />
          </div>
        </div>
      </div>
    </main>
  );
}
