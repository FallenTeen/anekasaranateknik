import React from 'react';
import NavigationComponent from '@/components/landingpage/Navbar';
import HeroSection from '../components/landingpage/HeroSection';
import AboutSection from '../components/landingpage/AboutSection';
import ProductsSection from '../components/landingpage/ProductSection';
import TestimonialSection from '../components/landingpage/TestimoniSection';
import ContactSection from '../components/landingpage/ContactSection';
import FooterSection from '../components/landingpage/Footer';


const App = () => {
  return (
    <div className="min-h-screen font-Poppins">
        <NavigationComponent />
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <TestimonialSection />
        <ContactSection />
        <FooterSection />
    </div>
  );
};

export default App;
