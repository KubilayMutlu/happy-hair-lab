import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <Testimonials />
    </Layout>
  );
};

export default Index;
