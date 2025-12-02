import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useProducts } from '@/hooks/useProducts';

const AdminDashboard = () => {
  const { data: products } = useProducts();

  const stats = [
    { 
      label: 'Produits', 
      value: products?.length || 0, 
      icon: Package, 
      href: '/admin/produits',
      color: 'text-blue-500 bg-blue-500/10' 
    },
    { 
      label: 'Commandes', 
      value: 0, 
      icon: ShoppingCart, 
      href: '/admin/commandes',
      color: 'text-green-500 bg-green-500/10' 
    },
    { 
      label: 'Utilisateurs', 
      value: 0, 
      icon: Users, 
      href: '/admin/utilisateurs',
      color: 'text-purple-500 bg-purple-500/10' 
    },
    { 
      label: 'Revenus', 
      value: '0 €', 
      icon: TrendingUp, 
      href: '/admin/commandes',
      color: 'text-amber-500 bg-amber-500/10' 
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.href}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/produits"
              className="p-4 bg-primary/5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
            >
              <Package className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-medium">Gérer les produits</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajouter, modifier ou supprimer des produits
              </p>
            </Link>
            <Link
              to="/admin/commandes"
              className="p-4 bg-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/50 transition-colors"
            >
              <ShoppingCart className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-medium">Voir les commandes</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gérer et suivre les commandes clients
              </p>
            </Link>
            <Link
              to="/admin/promotions"
              className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20 hover:border-amber-500/50 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
              <h3 className="font-medium">Créer une promotion</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configurer des codes promo et réductions
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
