import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MoreVertical, Eye, ChevronUp, ChevronDown, Users, CircleX, TriangleAlert, Building2, Plus, Edit, Power, PowerOff, Trash2 } from 'lucide-react';
import { Admin } from '@/types';
import { formatDate, formatFullDate, getStatusDotColor, getInitials, getTotalUnits, debounce } from '@/utils';
import { dataService } from '@/services/dataService';
import { useApp } from '@/context/AppContext';
import { useAdminStats } from '@/hooks/useDataFetching';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { TableSkeleton, SummaryCardSkeleton, TableSkeletonStandalone } from '../ui/Skeleton';
import Pagination from '../ui/Pagination';
import Dropdown from '../ui/Dropdown';
import ConfirmModal from '../ui/ConfirmModal';

interface AdminListProps {
  onViewAdmin: (admin: Admin) => void;
  onCreateAdmin: () => void;
  onEditAdmin: (admin: Admin) => void;
  onAdminUpdate: (updatedAdmin: Admin) => void;
  onDeleteAdmin: (adminId: number) => void;
}

const AdminList: React.FC<AdminListProps> = ({ onViewAdmin, onCreateAdmin, onEditAdmin, onAdminUpdate, onDeleteAdmin }) => {
  const { state, dispatch } = useApp();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; admin: Admin | null }>({
    isOpen: false,
    admin: null
  });
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });
  const [searchValue, setSearchValue] = useState('');

  const { data: summaryStats, loading: statsLoading, refetch: refetchStats } = useAdminStats();

  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      dispatch({ type: 'SET_SEARCH', payload: value });
    }, 300),
    [dispatch]
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync local search value with global state
  useEffect(() => {
    setSearchValue(state.filters.search);
  }, [state.filters.search]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K for search focus
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load data
  const loadData = useCallback(async () => {
    setTableLoading(true);
    try {
      const result = await dataService.getAdmins(
        state.pagination.currentPage,
        state.pagination.itemsPerPage,
        state.filters.search,
        state.filters.status,
        state.filters.sortBy,
        state.filters.sortOrder
      );
      setAdmins(result.admins);
      setPaginationInfo({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setTableLoading(false);
    }
  }, [state.filters, state.pagination.currentPage, state.pagination.itemsPerPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value); // immediately
    debouncedSearchChange(value); // Debounce
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive' | 'pending') => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  };

  const handleSort = (sortBy: 'name' | 'lastActivity' | 'societyCount' | 'loginCount' | 'ticketsResolved') => {
    const newSortOrder = state.filters.sortBy === sortBy && state.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder: newSortOrder } });
  };

  const handleSelectAdmin = (adminId: number) => {
    dispatch({ type: 'SELECT_ADMIN', payload: adminId });
  };

  const handleSelectAll = () => {
    if (state.selectedAdmins.length === admins.length) {
      dispatch({ type: 'CLEAR_SELECTION' });
    } else {
      dispatch({ type: 'SELECT_ALL_ADMINS', payload: admins.map(admin => admin.id) });
    }
  };

  // Action handlers for dropdown menu
  const handleEditAdmin = (admin: Admin) => {
    onEditAdmin(admin);
  };

  const handleToggleAdminStatus = async (admin: Admin) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    setActionLoading(admin.id);
    try {
      const updatedAdmin = await dataService.updateAdminStatus(admin.id, newStatus);
      if (updatedAdmin) {
        onAdminUpdate(updatedAdmin);
        // Refresh the admin list and stats
        loadData();
        refetchStats();
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = (admin: Admin) => {
    setDeleteModal({ isOpen: true, admin });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.admin) return;

    setActionLoading(deleteModal.admin.id);
    try {
      const success = await dataService.deleteAdmin(deleteModal.admin.id);
      if (success) {
        onDeleteAdmin(deleteModal.admin.id);
        loadData();
        refetchStats();
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    } finally {
      setActionLoading(null);
      setDeleteModal({ isOpen: false, admin: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, admin: null });
  };

  const getSortIcon = (column: string) => {
    if (state.filters.sortBy !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return state.filters.sortOrder === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const renderSortableHeader = (column: string, label: string) => (
    <button
      onClick={() => handleSort(column as 'name' | 'lastActivity' | 'societyCount' | 'loginCount' | 'ticketsResolved')}
      className="flex cursor-pointer items-center space-x-1 hover:text-gray-700 transition-colors"
    >
      <span>{label}</span>
      {getSortIcon(column)}
    </button>
  );

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Admins Management</h1>
            <p className="text-gray-600">Manage platform administrators and their society assignments</p>
          </div>
          <Button variant="gradient" className="flex items-center space-x-2">
            <span className="text-lg">+</span>
            <span>Create New Admin</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))}
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="p-6">
              <TableSkeletonStandalone />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-xl rounded-xl p-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Platform Admins Management</h1>
          <p className="text-gray-600 text-sm tracking-tight font-medium">Manage platform administrators and their society assignments</p>
        </div>
        <Button variant="gradient" onClick={onCreateAdmin} className="flex rounded-xl items-center space-x-2 whitespace-nowrap">
          <Plus size={16} />
          <span>Create New Admin</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{summaryStats?.activeCount || 0}</p>
                    <p className="text-xs text-gray-600 font-medium">Active Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center">
                    <CircleX className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{summaryStats?.inactiveCount || 0}</p>
                    <p className="text-xs text-gray-600 font-medium">Inactive Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <TriangleAlert className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{summaryStats?.pendingCount || 0}</p>
                    <p className="text-xs text-gray-600 font-medium">Pending Approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{summaryStats?.totalAssignments || 0}</p>
                    <p className="text-xs text-gray-600 font-medium">Total Assignments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <Card className='shadow-xl'>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-1 flex-col sm:flex-row gap-4">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="search-input"
                  placeholder="Search admins by name or email... (Ctrl+K)"
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 placeholder:text-gray-500/60 placeholder:text-sm text-sm font-medium placeholder:font-medium"
                />
              </div>

              <select
                value={state.filters.status}
                onChange={(e) => handleStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
                className="px-3 py-2 cursor-pointer text-sm font-medium border border-gray-200 rounded-lg focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <Button variant="secondary" className="flex items-center space-x-2">
              <Filter size={16} />
              <span>More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Table */}
      {tableLoading ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={state.selectedAdmins.length === admins.length && admins.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 cursor-pointer"
                          />
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('name', 'Admin Details')}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          Status
                        </th>
                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('societyCount', 'Assigned Societies')}
                        </th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('lastActivity', 'Last Activity')}
                        </th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('loginCount', 'Performance')}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      <TableSkeleton />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : admins.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {state.filters.search ? 'No search results found' : 'No admins found'}
              </h3>
              <p className="text-gray-500 text-sm">
                {state.filters.search
                  ? `No admins match your search for "${state.filters.search}"`
                  : 'There are no admins in the system yet.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={state.selectedAdmins.length === admins.length && admins.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 cursor-pointer"
                          />
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('name', 'Admin Details')}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          Status
                        </th>
                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('societyCount', 'Assigned Societies')}
                        </th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('lastActivity', 'Last Activity')}
                        </th>
                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium">
                          {renderSortableHeader('loginCount', 'Performance')}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4">
                            <input
                              type="checkbox"
                              checked={state.selectedAdmins.includes(admin.id)}
                              onChange={() => handleSelectAdmin(admin.id)}
                              className="rounded cursor-pointer border-gray-300"
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {admin.avatar ? (
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {getInitials(admin.name)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-sm truncate">{admin.name}</p>
                                <p className="text-xs font-medium text-gray-500 truncate">{admin.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(admin.status)}`}></div>
                              <Badge variant={admin.status === 'active' ? 'success' : admin.status === 'inactive' ? 'error' : 'warning'} className='text-xs'>
                                {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                              </Badge>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4">
                            <div>
                              <p className="text-xs font-medium text-gray-900">
                                {admin.assignedSocieties.length} societies
                              </p>
                              <p className="text-xs font-medium text-gray-500">
                                {getTotalUnits(admin.assignedSocieties)} total units
                              </p>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4">
                            <div>
                              <p className="text-xs font-medium text-gray-900">{formatDate(admin.lastActivity)}</p>
                              <p className="text-xs font-medium text-gray-500">{formatFullDate(admin.lastActivity)}</p>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4">
                            <div>
                              <p className="text-xs font-medium text-gray-900">{admin.loginCount} logins</p>
                              <p className="text-xs font-medium text-gray-500">{admin.ticketsResolved} tickets resolved</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onViewAdmin(admin)}
                                className="p-1 cursor-pointer rounded hover:bg-gray-100"
                                title="View"
                              >
                                <Eye size={16} className="text-gray-600" />
                              </button>
                              <Dropdown
                                trigger={
                                  <button
                                    className="p-1 cursor-pointer rounded hover:bg-gray-100"
                                    title="More options"
                                  >
                                    <MoreVertical size={16} className="text-gray-600" />
                                  </button>
                                }
                                items={[
                                  {
                                    label: 'Edit',
                                    icon: <Edit size={14} />,
                                    onClick: () => handleEditAdmin(admin)
                                  },
                                  {
                                    label: actionLoading === admin.id
                                      ? (admin.status === 'active' ? 'Disabling...' : 'Enabling...')
                                      : (admin.status === 'active' ? 'Disable' : 'Enable'),
                                    icon: admin.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />,
                                    onClick: () => handleToggleAdminStatus(admin),
                                    disabled: actionLoading === admin.id
                                  },
                                  {
                                    label: 'Delete',
                                    icon: <Trash2 size={14} />,
                                    onClick: () => handleDeleteAdmin(admin),
                                    variant: 'destructive'
                                  }
                                ]}
                                align="right"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!tableLoading && (
        <Pagination
          currentPage={paginationInfo.page}
          totalPages={paginationInfo.totalPages}
          totalItems={paginationInfo.total}
          itemsPerPage={state.pagination.itemsPerPage}
          onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
          hasResults={admins.length > 0}
          hasSearch={!!state.filters.search}
          noResultsMessage=""
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        adminName={deleteModal.admin?.name || ''}
        isLoading={actionLoading === deleteModal.admin?.id}
      />
    </div>
  );
};

export default AdminList; 