export interface Society {
  id: number;
  name: string;
  unitCount: number;
}

export interface Activity {
  id: number;
  action: string;
  society: string;
  timestamp: string;
  type: 'approval' | 'update' | 'resolution' | 'creation';
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  assignedSocieties: Society[];
  lastActivity: string;
  createdAt: string;
  loginCount: number;
  ticketsResolved: number;
  recentActivities: Activity[];
  avatar?: string;
}

export interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending';
  assignedSocieties: number[];
  permissions: string[];
}

export interface FilterState {
  search: string;
  status: 'all' | 'active' | 'inactive' | 'pending';
  sortBy: 'name' | 'lastActivity' | 'societyCount';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
} 