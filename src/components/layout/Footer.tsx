import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-semibold">
              Happy Hair Lab
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Prendre soin de ses cheveux, naturellement et durablement. Formules actives, ingrédients sélectionnés, efficacité prouvée.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Produits</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/produits?category=anti-chute" className="hover:text-primary-foreground transition-colors">
                  Anti-chute
                </Link>
              </li>
              <li>
                <Link to="/produits?category=camouflage" className="hover:text-primary-foreground transition-colors">
                  Camouflage
                </Link>
              </li>
              <li>
                <Link to="/produits" className="hover:text-primary-foreground transition-colors">
                  Tous les produits
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/a-propos" className="hover:text-primary-foreground transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-primary-foreground transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link to="/mentions-legales" className="hover:text-primary-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-primary-foreground transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="hover:text-primary-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/livraison" className="hover:text-primary-foreground transition-colors">
                  Livraison & Retours
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Happy Hair Lab. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/50">
              <span>Paiement sécurisé</span>
              <span>•</span>
              <span>Livraison France</span>
              <span>•</span>
              <span>Service client</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
