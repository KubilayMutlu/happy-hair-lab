import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.jpg';
import DarkModeToggle from "@/components/DarkModeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/produits', label: 'Produits' },
    { href: '/articles', label: 'Articles' },
    { href: '/a-propos', label: 'À propos' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
          >
            <img src={logo} alt="Happy Hair Lab" className="h-20 md:h-20 w-auto" />
          </Link>
          <div
  className={cn(
    "px-4 py-2 rounded text-white",
    isScrolled ? "bg-gray-800" : "bg-gray-600",
    "transition-colors",
    "md:flex hidden"
  )}
>
  Test Dark Mode
</div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  location.pathname === link.href 
                    ? 'text-accent' 
                    : 'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/compte">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <DarkModeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openCart}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'py-3 px-4 rounded-md text-base font-medium transition-colors',
                  location.pathname === link.href 
                    ? 'bg-secondary text-accent' 
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/compte"
              className="py-3 px-4 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Mon compte
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
