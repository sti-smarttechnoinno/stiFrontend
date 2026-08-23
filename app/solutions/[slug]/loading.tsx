import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SolutionDetailSkeleton from "../../components/solutions/detail/SolutionSkeleton";

export default function Loading() {
  return (
    <>
      <Navbar />
      <SolutionDetailSkeleton />
      <Footer />
    </>
  );
}
