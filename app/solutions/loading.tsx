import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="animate-pulse bg-white">
        {/* Hero Section Skeleton */}
        <section className="relative bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
            <div className="mb-8 h-4 w-36 rounded bg-gray-200" />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-4 h-4 w-28 rounded-full bg-red-primary/15" />
                <div className="space-y-3 mb-6">
                  <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-gray-200" />
                  <div className="h-10 sm:h-12 w-3/5 rounded-xl bg-gray-200" />
                </div>
                <div className="space-y-2 max-w-xl">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-5/6 rounded bg-gray-100" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[400px] aspect-square rounded-3xl bg-gray-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Grid Section Skeleton */}
        <section className="py-28 lg:py-36 bg-gray-50/50">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
            <div className="mb-16 text-center flex flex-col items-center">
              <div className="mb-3 h-4 w-28 rounded bg-red-primary/20" />
              <div className="mb-4 h-8 w-72 rounded bg-gray-200" />
              <div className="h-4 w-96 max-w-full rounded bg-gray-200" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col h-[280px]">
                  <div className="mb-5 h-14 w-14 rounded-2xl bg-gray-100" />
                  <div className="mb-3 h-5 w-3/5 rounded bg-gray-200" />
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="h-3.5 w-full rounded bg-gray-100" />
                    <div className="h-3.5 w-5/6 rounded bg-gray-100" />
                    <div className="h-3.5 w-4/6 rounded bg-gray-100" />
                  </div>
                  <div className="mt-auto h-4 w-28 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
