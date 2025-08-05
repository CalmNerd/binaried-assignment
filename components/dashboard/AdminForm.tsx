import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Admin, AdminFormData } from '@/types';
import { useSocieties } from '@/hooks/useDataFetching';
import { debounce } from '@/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SocietyDropdownSkeleton } from '../ui/Skeleton';


interface AdminFormProps {
  admin?: Admin;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminFormData) => void;
  focusSociety?: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({ admin, isOpen, onClose, onSubmit, focusSociety = false }) => {
  const [selectedSocieties, setSelectedSocieties] = useState<number[]>([]);
  const [societySearch, setSocietySearch] = useState('');
  const [societySearchValue, setSocietySearchValue] = useState('');
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const societyInputRef = React.useRef<HTMLInputElement>(null);
  
  // Use the custom hook for societies
  const { data: societies, loading } = useSocieties();

  // debounced society search
  const debouncedSocietySearch = React.useCallback(
    debounce((value: string) => {
      setSocietySearch(value);
    }, 300),
    []
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus on society input when focusSociety is true
  useEffect(() => {
    if (focusSociety && isOpen && societyInputRef.current) {
      setTimeout(() => {
        societyInputRef.current?.focus();
        setShowSocietyDropdown(true);
      }, 100);
    }
  }, [focusSociety, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.society-dropdown-container')) {
        setShowSocietyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AdminFormData>();

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status === 'inactive' ? 'pending' : admin.status,
        assignedSocieties: admin.assignedSocieties.map(s => s.id),
        permissions: []
      });
      setSelectedSocieties(admin.assignedSocieties.map(s => s.id));
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        status: 'pending',
        assignedSocieties: [],
        permissions: []
      });
      setSelectedSocieties([]);
    }
    setSocietySearch('');
    setSocietySearchValue('');
  }, [admin, reset]);

  const filteredSocieties = (societies || []).filter(society =>
    society.name.toLowerCase().includes(societySearch.toLowerCase())
  );

  const handleSocietyToggle = (societyId: number) => {
    setSelectedSocieties(prev =>
      prev.includes(societyId)
        ? prev.filter(id => id !== societyId)
        : [...prev, societyId]
    );
  };

  const handleSocietySearchChange = (value: string) => {
    setSocietySearchValue(value);
    debouncedSocietySearch(value);
  };

  const handleFormSubmit = async (data: AdminFormData) => {
    try {
      onSubmit({
        ...data,
        assignedSocieties: selectedSocieties
      });
      
      // Reset form
      reset();
      setSelectedSocieties([]);
      setSocietySearch('');
      setShowSocietyDropdown(false);
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{admin ? 'Edit Admin' : 'Create New Admin'}</h2>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="Enter phone number"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Society Assignments */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Society Assignments</h3>
              <div className="relative society-dropdown-container">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    ref={societyInputRef}
                    placeholder={loading ? "Loading societies..." : "Search societies..."}
                    value={societySearchValue}
                    onChange={(e) => handleSocietySearchChange(e.target.value)}
                    onFocus={() => setShowSocietyDropdown(true)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                
                {showSocietyDropdown && (
                  <div 
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {loading ? (
                      <SocietyDropdownSkeleton />
                    ) : filteredSocieties.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        No societies found
                      </div>
                    ) : (
                      filteredSocieties.map((society) => (
                        <div
                          key={society.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSocietyToggle(society.id)}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedSocieties.includes(society.id)}
                              onChange={() => {}}
                              className="rounded border-gray-300 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{society.name}</p>
                              <p className="text-xs text-gray-500">{society.unitCount} units</p>
                            </div>
                          </div>
                          {selectedSocieties.includes(society.id) && (
                            <Check size={16} className="text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Societies */}
              {selectedSocieties.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Societies:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSocieties.map((societyId) => {
                      const society = (societies || []).find(s => s.id === societyId);
                      return society ? (
                        <div
                          key={society.id}
                          className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span className="truncate max-w-32">{society.name}</span>
                          <button
                            type="button"
                            onClick={() => handleSocietyToggle(society.id)}
                            className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Permissions & Access Level</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'View Residents',
                  'Manage Residents',
                  'View Reports',
                  'Manage Maintenance',
                  'Send Notifications',
                  'Manage Payments'
                ].map((permission) => (
                  <div key={permission} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={permission}
                      {...register('permissions')}
                      value={permission}
                      className="rounded cursor-pointer border-gray-300"
                    />
                    <label htmlFor={permission} className="text-sm text-gray-700">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="w-full sm:w-auto"
              >
                {admin ? 'Update Admin' : 'Create Admin'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm; 