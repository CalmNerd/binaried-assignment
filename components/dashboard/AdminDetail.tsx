import React, { useState } from 'react';
import { ArrowLeft, Edit, Power, Phone, Calendar, Clock, CheckCircle, PowerOff, User, TrendingUp, Building2, EllipsisVertical } from 'lucide-react';
import { Admin, Activity } from '@/types';
import { formatDate, getStatusDotColor, getActivityIcon, getActivityColor, getInitials } from '@/utils';
import { dataService } from '@/services/dataService';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Modal from '../ui/Modal';
import { ActivityItemSkeleton } from '../ui/Skeleton';

interface AdminDetailProps {
  admin: Admin;
  onBack: () => void;
  onEdit: (admin: Admin, focusSociety?: boolean) => void;
  onAdminUpdate: (updatedAdmin: Admin) => void;
  onRefresh?: () => void;
}

const AdminDetail: React.FC<AdminDetailProps> = ({ admin, onBack, onEdit, onAdminUpdate, onRefresh }) => {
  const [isDisabling, setIsDisabling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const handleToggleAdminStatus = async () => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    
    setIsDisabling(true);
    try {
      const updatedAdmin = await dataService.updateAdminStatus(admin.id, newStatus);
      if (updatedAdmin) {
        onAdminUpdate(updatedAdmin);
        // Refresh stats if callback is provided
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
    } finally {
      setIsDisabling(false);
    }
  };

  const handleViewAllActivities = async () => {
    setIsModalOpen(true);
    setIsLoadingActivities(true);
    try {
      const activities = await dataService.getAllActivities(admin.id);
      setAllActivities(activities);
    } catch (error) {
      console.error('Error fetching all activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white shadow-xl rounded-xl p-4 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Platform Admin Details</h1>
            <p className="text-gray-600 text-sm tracking-tight font-medium">Comprehensive view of admin profile and activities</p>
          </div>
        </div>
        <div className="flex items-center flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button variant="gradient" onClick={() => onEdit(admin)} className="flex w-full md:w-auto whitespace-nowrap items-center space-x-2 rounded-xl">
            <Edit size={14} />
            <span className='text-sm font-medium'>Edit Admin</span>
          </Button>
          <Button
            variant={admin.status === 'active' ? 'destructive' : 'gradient'}
            className="flex w-full md:w-auto items-center space-x-2 rounded-xl"
            onClick={handleToggleAdminStatus}
            disabled={isDisabling}
          >
            {admin.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />}
            <span className='text-sm font-medium'>
              {isDisabling 
                ? (admin.status === 'active' ? 'Disabling...' : 'Enabling...') 
                : (admin.status === 'active' ? 'Disable' : 'Enable')
              }
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                {admin.avatar ? (
                  <img 
                    src={admin.avatar} 
                    alt={admin.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(admin.name)}
                  </div>
                )}
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-bold text-gray-900">{admin.name}</h2>
                  <p className="text-gray-600 text-sm font-medium">{admin.email}</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(admin.status)}`}></div>
                    <Badge variant={admin.status === 'active' ? 'success' : admin.status === 'inactive' ? 'error' : 'warning'} className='text-xs font-medium'>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">{admin.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">
                    Joined {formatDate(admin.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">
                    Last active {formatDate(admin.lastActivity)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className='px-6 pt-6 pb-0'>
              <CardTitle className='font-bold text-sm text-gray-900'>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Total Logins</p>
                    <p className="text-[10px] font-medium text-gray-500">All time</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">{admin.loginCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Tickets Resolved</p>
                    <p className="text-[10px] font-medium text-gray-500">This month</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600">{admin.ticketsResolved}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Societies Managed</p>
                    <p className="text-[10px] font-medium text-gray-500">Currently assigned</p>
                  </div>
                </div>
                <span className="font-bold text-purple-600">{admin.assignedSocieties.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 col-span-1 lg:col-span-2">
          {/* Assigned Societies */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pt-6 pb-0 gap-4">
              <CardTitle className='font-bold text-sm text-gray-900'>Assigned Societies</CardTitle>
              <button 
                onClick={() => onEdit(admin, true)}
                className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage Assignments
              </button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {admin.assignedSocieties.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200/50">
                  <p className="text-sm text-gray-500 font-medium">No assigned societies</p>
                </div>
              ) : (
                admin.assignedSocieties.map((society) => (
                  <div key={society.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 truncate">{society.name}</p>
                        <p className="text-[10px] font-medium text-gray-500">{society.unitCount} units</p>
                      </div>
                    </div>
                    <button className="p-1 cursor-pointer rounded hover:bg-gray-100">
                      <EllipsisVertical size={16} className='text-gray-500' />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pt-6 pb-0 gap-4">
              <CardTitle className='font-bold text-sm text-gray-900'>Recent Activities</CardTitle>
              {admin.recentActivities.length > 4 && (
                <button 
                  onClick={handleViewAllActivities}
                  className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Activities
                </button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {admin.recentActivities.length === 0 ? (
                <div className="flex items-center justify-center p-6 bg-gray-50/40 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-50">
                  <p className="text-sm text-gray-500 font-medium">No recent activities</p>
                </div>
              ) : (
                admin.recentActivities.slice(0, 4).map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-2 p-3 rounded-lg hover:shadow-md transition-all duration-300 bg-gray-50/40 border border-gray-50">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <IconComponent size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{activity.action}</p>
                        <p className="text-[10px] font-medium text-gray-500 truncate">
                          {activity.society}
                        </p>
                        <p className="text-[10px] font-medium text-gray-500">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Activities Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Activities"
        size="xl"
      >
        <div className="space-y-4">
          {isLoadingActivities ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <ActivityItemSkeleton key={index} />
              ))}
            </div>
          ) : allActivities.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 font-medium">No activities found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg hover:shadow-md transition-all duration-300 bg-gray-50/40 border border-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                      <p className="text-xs font-medium text-gray-500 truncate">
                        {activity.society}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminDetail; 