import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SolutionDetailSkeleton from '@/app/components/solutions/detail/SolutionSkeleton';

export default function Loading() {
  return (
    <>
      <Navbar />
      <SolutionDetailSkeleton />
      <Footer />
    </>
  );
}
