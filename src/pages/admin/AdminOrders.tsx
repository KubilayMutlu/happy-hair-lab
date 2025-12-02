import AdminLayout from './AdminLayout';

const AdminOrders = () => {
  return (
    <AdminLayout title="Commandes">
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-muted-foreground text-center py-12">
          Aucune commande pour le moment.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
