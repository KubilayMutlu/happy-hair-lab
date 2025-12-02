import AdminLayout from './AdminLayout';

const AdminPromotions = () => {
  return (
    <AdminLayout title="Promotions">
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-muted-foreground text-center py-12">
          Gestion des promotions à venir.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminPromotions;
