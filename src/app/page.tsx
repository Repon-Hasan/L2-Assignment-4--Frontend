import Hero from "@/components/Banner";
import Features from "@/components/Features";
import Listings from "@/components/Listining";
import Testimonials from "@/components/Testimonial";
import Profile from "@/components/users/user";


export default function Home() {
  return (
   <div className="mx-28">\
           <Hero></Hero>
          <Features />
      <Listings />
      <Testimonials />
      <Profile></Profile>
       </div>
  );
}
