import HeroSection from "@/components/home/HeroSection";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import CustomerReviews from "@/components/home/CustomerReviews";

export default function Home() {
  return (
    <div >
          <HeroSection />
          <FeaturedEquipment />
          <CategoriesSection/>
          <WhyChooseUs />
          <HowItWorks />
          <CustomerReviews />
    </div>
  );
}
