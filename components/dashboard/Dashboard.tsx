import React, { useState } from 'react';
import { Admin, AdminFormData } from '@/types';
import { dataService } from '@/services/dataService';
import AdminList from './AdminList';
import AdminDetail from './AdminDetail';
import AdminForm from './AdminForm';
import toast from 'react-hot-toast';

type View = 'list' | 'detail' | 'form';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [focusSociety, setFocusSociety] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setCurrentView('detail');
  };

  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setFocusSociety(false);
    setIsFormOpen(true);
  };

  const handleEditAdmin = (admin: Admin, focusSocietyInput = false) => {
    setEditingAdmin(admin);
    setFocusSociety(focusSocietyInput);
    setIsFormOpen(true);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAdmin(null);
  };

  const handleFormSubmit = async (data: AdminFormData) => {
    try {
      if (editingAdmin) {
        // Update existing admin
        const updatedAdmin = await dataService.updateAdmin(editingAdmin.id, data);
        if (updatedAdmin) {
          setSelectedAdmin(updatedAdmin);
          toast.success('Admin updated successfully!');
        }
      } else {
        // Create admin
        const newAdmin = await dataService.createAdmin(data);
        if (newAdmin) {
          // Refresh the list view
          setCurrentView('list');
          toast.success('Admin created successfully!');
        }
      }
      // Refresh the admin list to update stats
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving admin:', error);
      toast.error('Failed to save admin. Please try again.');
    }
    setIsFormOpen(false);
    setEditingAdmin(null);
  };

  const handleAdminUpdate = (updatedAdmin: Admin) => {
    setSelectedAdmin(updatedAdmin);
  };

  const handleDeleteAdmin = (adminId: number) => {
    // If the deleted admin is currently selected, go back to list
    if (selectedAdmin && selectedAdmin.id === adminId) {
      setCurrentView('list');
      setSelectedAdmin(null);
    }
    // Refresh the admin stats on topp
    setRefreshKey(prev => prev + 1);
    toast.success('Admin deleted successfully!');
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAdmin(null);
    setFocusSociety(false);
  };

  return (
    <div className={className}>
      {currentView === 'list' && (
        <AdminList
          key={refreshKey}
          onViewAdmin={handleViewAdmin}
          onCreateAdmin={handleCreateAdmin}
          onEditAdmin={handleEditAdmin}
          onAdminUpdate={handleAdminUpdate}
          onDeleteAdmin={handleDeleteAdmin}
        />
      )}

      {currentView === 'detail' && selectedAdmin && (
        <AdminDetail
          admin={selectedAdmin}
          onBack={handleBackToList}
          onEdit={handleEditAdmin}
          onAdminUpdate={handleAdminUpdate}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      <AdminForm
        admin={editingAdmin || undefined}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        focusSociety={focusSociety}
      />
    </div>
  );
};

export default Dashboard; 