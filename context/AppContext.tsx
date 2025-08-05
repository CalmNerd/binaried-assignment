import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Types for global state
interface AppState {
  filters: {
    search: string;
    status: 'all' | 'active' | 'inactive' | 'pending';
    sortBy: 'name' | 'lastActivity' | 'societyCount' | 'loginCount' | 'ticketsResolved';
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  selectedAdmins: number[];
  preferences: {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
  };
  searchFocused: boolean;
}

// Action types
type AppAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: 'all' | 'active' | 'inactive' | 'pending' }
  | { type: 'SET_SORT'; payload: { sortBy: AppState['filters']['sortBy']; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'SELECT_ADMIN'; payload: number }
  | { type: 'SELECT_ALL_ADMINS'; payload: number[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SEARCH_FOCUSED'; payload: boolean }
  | { type: 'RESET_FILTERS' };

// Initial state
const initialState: AppState = {
  filters: {
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 12
  },
  selectedAdmins: [],
  preferences: {
    theme: 'light',
    sidebarCollapsed: false
  },
  searchFocused: false
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    
    case 'SET_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, status: action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    
    case 'SET_SORT':
      return {
        ...state,
        filters: {
          ...state.filters,
          sortBy: action.payload.sortBy,
          sortOrder: action.payload.sortOrder
        }
      };
    
    case 'SET_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.payload }
      };
    
    case 'SET_ITEMS_PER_PAGE':
      return {
        ...state,
        pagination: { ...state.pagination, itemsPerPage: action.payload, currentPage: 1 }
      };
    
    case 'SELECT_ADMIN':
      const adminId = action.payload;
      const isSelected = state.selectedAdmins.includes(adminId);
      return {
        ...state,
        selectedAdmins: isSelected
          ? state.selectedAdmins.filter(id => id !== adminId)
          : [...state.selectedAdmins, adminId]
      };
    
    case 'SELECT_ALL_ADMINS':
      return {
        ...state,
        selectedAdmins: action.payload
      };
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedAdmins: []
      };
    
    case 'SET_THEME':
      return {
        ...state,
        preferences: { ...state.preferences, theme: action.payload }
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        preferences: { ...state.preferences, sidebarCollapsed: !state.preferences.sidebarCollapsed }
      };
    
    case 'SET_SEARCH_FOCUSED':
      return {
        ...state,
        searchFocused: action.payload
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        pagination: { ...state.pagination, currentPage: 1 }
      };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load state from localStorage on mount (only on client)
  useEffect(() => {
    if (!mounted) return;
    
    const savedState = localStorage.getItem('admin-dashboard-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Only restore filters and preferences, not pagination or selections
        if (parsedState.filters?.search) {
          dispatch({ type: 'SET_SEARCH', payload: parsedState.filters.search });
        }
        if (parsedState.filters?.status) {
          dispatch({ type: 'SET_STATUS_FILTER', payload: parsedState.filters.status });
        }
        if (parsedState.filters?.sortBy && parsedState.filters?.sortOrder) {
          dispatch({ type: 'SET_SORT', payload: { 
            sortBy: parsedState.filters.sortBy, 
            sortOrder: parsedState.filters.sortOrder 
          }});
        }
        if (parsedState.preferences?.theme) {
          dispatch({ type: 'SET_THEME', payload: parsedState.preferences.theme });
        }
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, [mounted]);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      filters: state.filters,
      preferences: state.preferences
    };
    localStorage.setItem('admin-dashboard-state', JSON.stringify(stateToSave));
  }, [state.filters, state.preferences]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 