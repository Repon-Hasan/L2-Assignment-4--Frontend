import Hero from "@/components/Banner";
import Features from "@/components/Features";
import Listings from "@/components/Listining";
import Testimonials from "@/components/Testimonial";



export default function Home() {
  return (
   <div className="mx-0">
           <Hero></Hero>
          <Features />
      <Listings />
      <Testimonials />
      
       </div>
  );
}
