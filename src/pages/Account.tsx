import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, LogOut, Package, Settings, Shield, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
}

const Account = () => {
  const { user, isLoading, isAdmin, signUp, signIn, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  // Fetch profile when user is logged in
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, phone, address, city, postal_code')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const redirectUrl = `${window.location.origin}/compte`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Email envoyé !',
          description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
        });
        setMode('login');
        setFormData({ ...formData, email: '' });
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email déjà utilisé',
              description: 'Un compte existe déjà avec cette adresse email.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erreur d\'inscription',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Compte créé !',
            description: 'Vérifiez votre email pour confirmer votre inscription.',
          });
          setFormData({ email: '', password: '', firstName: '', lastName: '' });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Identifiants incorrects',
              description: 'Email ou mot de passe invalide.',
              variant: 'destructive',
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: 'Email non confirmé',
              description: 'Veuillez confirmer votre email avant de vous connecter.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erreur de connexion',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Connexion réussie',
            description: 'Bienvenue sur Happy Hair Lab !',
          });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Déconnexion',
      description: 'À bientôt !',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Logged in view
  if (user) {
    return (
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  Bonjour, {profile?.first_name || user.email?.split('@')[0]}
                </h1>
                <p className="text-muted-foreground">
                  Gérez votre compte et vos commandes
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    <Shield className="w-4 h-4" />
                    Administrateur
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => navigate('/compte/commandes')}
                  className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left group"
                >
                  <Package className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">Mes commandes</h3>
                  <p className="text-sm text-muted-foreground">
                    Suivez vos commandes et historique
                  </p>
                </button>
                
                <button
                  onClick={() => navigate('/compte/parametres')}
                  className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left group"
                >
                  <Settings className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">Paramètres</h3>
                  <p className="text-sm text-muted-foreground">
                    Modifiez vos informations personnelles
                  </p>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-6 bg-primary/5 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors text-left group md:col-span-2"
                  >
                    <Shield className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-1">Panneau d'administration</h3>
                    <p className="text-sm text-muted-foreground">
                      Gérez les produits, commandes et promotions
                    </p>
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <h2 className="font-semibold mb-4">Informations du compte</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Email</span>
                    <span>{user.email}</span>
                  </div>
                  {profile?.first_name && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Nom</span>
                      <span>{profile.first_name} {profile.last_name}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Téléphone</span>
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.address && (
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Adresse</span>
                      <span>{profile.address}, {profile.postal_code} {profile.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Out */}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Login/Register view
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
                {mode === 'forgot-password' ? (
                  <Mail className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {mode === 'login' ? 'Connexion' : mode === 'register' ? 'Créer un compte' : 'Mot de passe oublié'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Accédez à votre espace personnel'
                  : mode === 'register'
                  ? 'Rejoignez la communauté Happy Hair Lab'
                  : 'Entrez votre email pour réinitialiser votre mot de passe'
                }
              </p>
            </div>

            {/* Toggle - only show for login/register */}
            {mode !== 'forgot-password' && (
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
            )}

            {/* Back button for forgot password */}
            {mode === 'forgot-password' && (
              <button
                onClick={() => setMode('login')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </button>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot-password' ? (
              <form onSubmit={handleForgotPassword} className="space-y-5">
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
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </Button>
              </form>
            ) : (
              /* Login/Register Form */
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
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
                      required
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
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === 'register' && (
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 caractères
                    </p>
                  )}
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot-password')}
                      className="text-sm text-accent hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                      Chargement...
                    </span>
                  ) : (
                    mode === 'login' ? 'Se connecter' : 'Créer mon compte'
                  )}
                </Button>
              </form>
            )}

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
