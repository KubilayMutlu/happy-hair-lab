import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

const Account = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement auth with Supabase
    console.log('Auth:', mode, formData);
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {mode === 'login' ? 'Connexion' : 'Créer un compte'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Accédez à votre espace personnel'
                  : 'Rejoignez la communauté Happy Hair Lab'
                }
              </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-secondary rounded-lg p-1 mb-8">
              <button
                onClick={() => setMode('login')}
                className={cn(
                  'flex-1 py-2.5 rounded-md text-sm font-medium transition-all',
                  mode === 'login'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode('register')}
                className={cn(
                  'flex-1 py-2.5 rounded-md text-sm font-medium transition-all',
                  mode === 'register'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Inscription
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.fr"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" className="text-sm text-accent hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Button>
            </form>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              En continuant, vous acceptez nos{' '}
              <a href="/cgv" className="text-accent hover:underline">CGV</a>
              {' '}et notre{' '}
              <a href="/politique-confidentialite" className="text-accent hover:underline">
                politique de confidentialité
              </a>.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
