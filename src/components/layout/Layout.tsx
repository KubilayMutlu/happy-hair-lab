import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import PromoBanner from '@/components/home/PromoBanner';

interface LayoutProps {
  children: ReactNode;
  showPromoBanner?: boolean;
}

const Layout = ({ children, showPromoBanner = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showPromoBanner && <PromoBanner />}
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;
