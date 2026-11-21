import HeroSection from "@/components/home/HeroSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";

export default function Home() {
  return (
    <div >
          <HeroSection />
          <FeaturedEquipment />
          <CategoriesSection/>
          <WhyChooseUs />
          <CustomerReviews />
    </div>
  );
}
