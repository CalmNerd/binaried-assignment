import { Admin, FilterState } from '../types';

export const formatDate = (dateString: string): string => {
  if (dateString === 'Never') return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatFullDate = (dateString: string): string => {
  if (dateString === 'Never') return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'inactive':
      return 'text-red-600 bg-red-50';
    case 'pending':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusDotColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-red-500';
    case 'pending':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const filterAdmins = (admins: Admin[], filters: FilterState): Admin[] => {
  return admins.filter(admin => {
    // Search filter
    const searchMatch = filters.search === '' || 
      admin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      admin.email.toLowerCase().includes(filters.search.toLowerCase());
    
    // Status filter
    const statusMatch = filters.status === 'all' || admin.status === filters.status;
    
    return searchMatch && statusMatch;
  });
};

export const sortAdmins = (admins: Admin[], sortBy: string, sortOrder: 'asc' | 'desc'): Admin[] => {
  return [...admins].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'lastActivity':
        aValue = a.lastActivity === 'Never' ? new Date(0) : new Date(a.lastActivity);
        bValue = b.lastActivity === 'Never' ? new Date(0) : new Date(b.lastActivity);
        break;
      case 'societyCount':
        aValue = a.assignedSocieties.length;
        bValue = b.assignedSocieties.length;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const getTotalUnits = (societies: { unitCount: number }[]): number => {
  return societies.reduce((total, society) => total + society.unitCount, 0);
};

import { CheckCircle, Edit, Shield, Plus, Circle } from 'lucide-react';

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'approval':
      return CheckCircle;
    case 'update':
      return Edit;
    case 'resolution':
      return Shield;
    case 'creation':
      return Plus;
    default:
      return Circle;
  }
};

export const getActivityColor = (type: string): string => {
  switch (type) {
    case 'approval':
      return 'text-green-600';
    case 'update':
      return 'text-blue-600';
    case 'resolution':
      return 'text-purple-600';
    case 'creation':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

// Debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}; 