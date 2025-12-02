import AdminLayout from './AdminLayout';

const AdminUsers = () => {
  return (
    <AdminLayout title="Utilisateurs">
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-muted-foreground text-center py-12">
          Gestion des utilisateurs à venir.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
