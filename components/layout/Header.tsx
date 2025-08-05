import React from 'react';
import { Bell, Grid, ChevronDown, MessageCircleMore } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      'bg-white/10 backdrop-blur-sm border-b border-blue-200/40 px-4 sm:px-6 py-2 flex items-center justify-end',
      className
    )}>
      {/* Mobile Title - Only show on small screens */}
      {/* <div className="lg:hidden">
        <h1 className="text-lg font-bold text-gray-900">Platform Admin</h1>
      </div> */}

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Connect Button - Hide on very small screens */}
        <Button 
          variant="gradient" 
          size="sm" 
          className="hidden sm:flex rounded-sm items-center border-none opacity-80 space-x-2"
        >
          <MessageCircleMore size={16} />
          <span>Connect</span>
        </Button>

        {/* Notification Button */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-purple-600" />
        </button>

        {/* Grid Button */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Grid size={20} className="text-blue-600" />
        </button>

        {/* User Profile - Responsive */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            TU
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-sm font-bold tracking-tight text-gray-900">RWA ADMIN</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 