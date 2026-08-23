"use client";

export function SolutionDetailSkeleton() {
  return (
    <main className="animate-pulse bg-white">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 sm:mb-8 flex items-center gap-2">
            <div className="h-3 w-12 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-[600px] mx-auto lg:mx-0 w-full">
              {/* Badge */}
              <div className="mb-4 h-5 w-32 rounded-full bg-red-primary/15" />

              {/* Title */}
              <div className="space-y-3 mb-6">
                <div className="h-10 sm:h-12 w-11/12 rounded-xl bg-gray-200" />
                <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-gray-200" />
              </div>

              {/* Description */}
              <div className="space-y-2.5 mb-8">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-11/12 rounded bg-gray-100" />
                <div className="h-4 w-4/5 rounded bg-gray-100" />
              </div>

              {/* Highlights */}
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-green-200 shrink-0" />
                    <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                <div className="h-12 w-40 rounded-full bg-red-primary/20" />
                <div className="h-12 w-36 rounded-full bg-gray-200" />
              </div>
            </div>

            {/* Graphic illustration placeholder */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[480px] aspect-square rounded-3xl bg-gray-100/80 border border-gray-100 flex items-center justify-center p-8">
                <div className="w-3/4 h-3/4 rounded-2xl bg-gray-200/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16 text-center flex flex-col items-center">
            <div className="mb-3 h-4 w-24 rounded bg-red-primary/20" />
            <div className="mb-4 h-8 w-64 rounded bg-gray-200" />
            <div className="h-4 w-96 max-w-full rounded bg-gray-200" />
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col">
                <div className="mb-5 h-14 w-14 rounded-2xl bg-gray-100" />
                <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Solutions Skeleton */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center flex flex-col items-center">
            <div className="mb-3 h-4 w-20 rounded bg-red-primary/20" />
            <div className="mb-4 h-8 w-56 rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col h-[220px]">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-gray-100" />
                <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-4/5 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SolutionDetailSkeleton;
