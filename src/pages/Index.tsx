
import React from 'react';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { 
  Hero, 
  Benefits, 
  Features, 
  Testimonials, 
  PricingPlans, 
  FAQ, 
  Footer 
} from '@/components/home';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-x-hidden no-scrollbar">
      <AuthHeader hideNavigation={true} />
      
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
      <PricingPlans />
      <FAQ />
      <Footer />
    </div>
  );
}
