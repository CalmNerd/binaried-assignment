import { Admin, Society, AdminFormData, Activity } from '@/types';

// Import JSON
import mockData from '@/data/mockData.json';

interface RawAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  assignedSocieties: number[];
  lastActivity: string;
  createdAt: string;
  loginCount: number;
  ticketsResolved: number;
  avatar?: string;
  recentActivities: Array<{
    id: number;
    action: string;
    society: string;
    timestamp: string;
    type: 'approval' | 'update' | 'resolution' | 'creation';
  }>;
}

interface RawSociety {
  id: number;
  name: string;
  unitCount: number;
}

interface MockData {
  societies: RawSociety[];
  admins: RawAdmin[];
}

// Transform raw data to match our types
const transformAdmin = (rawAdmin: RawAdmin, societies: Society[]): Admin => {
  const assignedSocieties = societies.filter(society => 
    rawAdmin.assignedSocieties.includes(society.id)
  );

  return {
    id: rawAdmin.id,
    name: rawAdmin.name,
    email: rawAdmin.email,
    phone: rawAdmin.phone,
    status: rawAdmin.status,
    assignedSocieties,
    lastActivity: rawAdmin.lastActivity,
    createdAt: rawAdmin.createdAt,
    loginCount: rawAdmin.loginCount,
    ticketsResolved: rawAdmin.ticketsResolved,
    avatar: rawAdmin.avatar,
    recentActivities: rawAdmin.recentActivities
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DataService {
  private static instance: DataService;
  private data: MockData;
  private societies: Society[];
  private admins: Admin[];

  private constructor() {
    this.data = mockData as MockData;
    this.societies = this.data.societies;
    this.admins = this.data.admins.map(rawAdmin => 
      transformAdmin(rawAdmin, this.societies)
    );
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Get all societies
  async getSocieties(): Promise<Society[]> {
    await delay(100); // Simulatedelay
    return this.societies;
  }

  // Get all admins with optional pagination, search, and filtering
  async getAdmins(
    page: number = 1, 
    limit: number = 12,
    search: string = '',
    status: 'all' | 'active' | 'inactive' | 'pending' = 'all',
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{
    admins: Admin[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await delay(200);
    
    // Filter admins
    const filteredAdmins = this.admins.filter(admin => {
      const searchMatch = !search || 
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase());
      
      const statusMatch = status === 'all' || admin.status === status;
      
      return searchMatch && statusMatch;
    });

    // Sort admins
    const sortedAdmins = [...filteredAdmins].sort((a, b) => {
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
        case 'loginCount':
          aValue = a.loginCount;
          bValue = b.loginCount;
          break;
        case 'ticketsResolved':
          aValue = a.ticketsResolved;
          bValue = b.ticketsResolved;
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
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAdmins = sortedAdmins.slice(startIndex, endIndex);
    
    return {
      admins: paginatedAdmins,
      total: sortedAdmins.length,
      page,
      totalPages: Math.ceil(sortedAdmins.length / limit)
    };
  }

  // Get admin by ID
  async getAdminById(id: number): Promise<Admin | null> {
    await delay(150);
    return this.admins.find(admin => admin.id === id) || null;
  }

  // Search admins
  async searchAdmins(query: string): Promise<Admin[]> {
    await delay(300);
    
    const searchTerm = query.toLowerCase();
    return this.admins.filter(admin => 
      admin.name.toLowerCase().includes(searchTerm) ||
      admin.email.toLowerCase().includes(searchTerm)
    );
  }

  // Filter admins by status
  async filterAdminsByStatus(status: 'all' | 'active' | 'inactive' | 'pending'): Promise<Admin[]> {
    await delay(100);
    
    if (status === 'all') {
      return this.admins;
    }
    
    return this.admins.filter(admin => admin.status === status);
  }

  // Get admin statistics
  async getAdminStats(): Promise<{
    activeCount: number;
    inactiveCount: number;
    pendingCount: number;
    totalAssignments: number;
  }> {
    await delay(50);
    
    const activeCount = this.admins.filter(a => a.status === 'active').length;
    const inactiveCount = this.admins.filter(a => a.status === 'inactive').length;
    const pendingCount = this.admins.filter(a => a.status === 'pending').length;
    const totalAssignments = this.admins.reduce((sum, admin) => 
      sum + admin.assignedSocieties.length, 0
    );

    return {
      activeCount,
      inactiveCount,
      pendingCount,
      totalAssignments
    };
  }

  // Create new admin (simulate)
  async createAdmin(adminData: AdminFormData): Promise<Admin> {
    await delay(500);
    
    // Get societies by IDs
    const societies = this.societies.filter(s => adminData.assignedSocieties.includes(s.id));
    
    const newAdmin: Admin = {
      id: Math.max(...this.admins.map(a => a.id)) + 1,
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      status: adminData.status,
      assignedSocieties: societies,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      loginCount: 0,
      ticketsResolved: 0,
      avatar: undefined, // New admins don't have avatars initially
      recentActivities: []
    };
    
    this.admins.push(newAdmin);
    return newAdmin;
  }

  // Update admin (simulate)
  async updateAdmin(id: number, adminData: AdminFormData): Promise<Admin | null> {
    await delay(400);
    
    const adminIndex = this.admins.findIndex(a => a.id === id);
    if (adminIndex === -1) return null;
    
    // Get societies by IDs
    const societies = this.societies.filter(s => adminData.assignedSocieties.includes(s.id));
    
    this.admins[adminIndex] = {
      ...this.admins[adminIndex],
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      status: adminData.status,
      assignedSocieties: societies
    };
    
    return this.admins[adminIndex];
  }

  // Delete admin (simulate)
  async deleteAdmin(id: number): Promise<boolean> {
    await delay(300);
    
    const adminIndex = this.admins.findIndex(a => a.id === id);
    if (adminIndex === -1) return false;
    
    this.admins.splice(adminIndex, 1);
    return true;
  }

  // Update admin status
  async updateAdminStatus(id: number, status: 'active' | 'inactive' | 'pending'): Promise<Admin | null> {
    await delay(200);
    
    const adminIndex = this.admins.findIndex(a => a.id === id);
    if (adminIndex === -1) return null;
    
    this.admins[adminIndex] = {
      ...this.admins[adminIndex],
      status
    };
    
    return this.admins[adminIndex];
  }

  // Get all activities for an admin (including historical activities)
  async getAllActivities(adminId: number): Promise<Activity[]> {
    await delay(300);
    
    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return [];

    // Generate additional historical activities based on the admin's data
    const allActivities = [...admin.recentActivities];
    
    // Add more historical activities based on login count and tickets resolved
    const additionalActivities: Activity[] = [];
    
    // Generate activities based on login count
    for (let i = 0; i < Math.min(admin.loginCount, 20); i++) {
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const activityTypes: ('approval' | 'update' | 'resolution' | 'creation')[] = ['approval', 'update', 'resolution', 'creation'];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)] as 'approval' | 'update' | 'resolution' | 'creation';
      
      const activities = [
        'Logged into system',
        'Updated profile settings',
        'Viewed dashboard',
        'Checked notifications',
        'Accessed admin panel'
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const randomSociety = admin.assignedSocieties[Math.floor(Math.random() * admin.assignedSocieties.length)];
      
      additionalActivities.push({
        id: 1000 + i,
        action: randomActivity,
        society: randomSociety?.name || 'System',
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        type: randomType
      });
    }
    
    // Generate activities based on tickets resolved
    for (let i = 0; i < Math.min(admin.ticketsResolved, 15); i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 1;
      const randomSociety = admin.assignedSocieties[Math.floor(Math.random() * admin.assignedSocieties.length)];
      
      const ticketActivities = [
        'Resolved maintenance complaint',
        'Processed payment request',
        'Approved visitor registration',
        'Updated resident information',
        'Created maintenance ticket',
        'Resolved parking dispute',
        'Approved community event',
        'Updated security settings'
      ];
      
      const randomActivity = ticketActivities[Math.floor(Math.random() * ticketActivities.length)];
      
      additionalActivities.push({
        id: 2000 + i,
        action: randomActivity,
        society: randomSociety?.name || 'System',
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        type: 'resolution'
      });
    }
    
    // Combine and sort by timestamp (newest first)
    const combinedActivities = [...allActivities, ...additionalActivities];
    return combinedActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

// Export singleton instance
export const dataService = DataService.getInstance(); 