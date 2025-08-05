import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { esButtonColors, menuItems } from '@/data/constants';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed cursor-pointer top-2 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600 rounded-lg flex items-center justify-center text-xs font-semibold text-white">
                ES
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Profile</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    item.active && 'bg-gradient-to-r from-blue-500 to-violet-500 p-2 rounded-lg'
                  )}
                >
                  <button
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left cursor-pointer',
                      isExpanded
                        ? 'text-gray-700 bg-gray-100 hover:text-gray-900'
                        : 'text-gray-500 bg-gray-100 hover:text-gray-700',
                      item.active ? 'bg-white/30 text-white hover:text-white' : 'bg-gray-100'
                    )}
                    onClick={toggleMobileMenu}
                  >
                    <item.icon size={16} className={`${item.active ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn('hidden lg:flex h-screen relative', className)}>
        <div className="w-16 bg-gray-900 flex flex-col items-center py-6 space-y-3">
          {esButtonColors.map((color, index) => (
            <div
              key={index}
              className={cn(
                'relative w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold text-white transition-all',
                color,
                index === 1 && 'ring-3 ring-white shadow-lg' // Highlight
              )}
            >
              {index === 1 && <div className="absolute -top-1 -right-0.5 border-2 border-white w-3 h-3 bg-green-500 rounded-full"></div>}
              ES
            </div>
          ))}
        </div>

        <div className={cn(
          'bg-white border-r border-gray-100 flex flex-col transition-all duration-300',
          isExpanded ? 'w-64' : 'w-16'
        )}>
          {/* Selected Profile*/}
          <div className={cn(
            'border-b border-gray-100 transition-all duration-300',
            isExpanded ? 'p-4' : 'px-2 py-4'
          )}>
            {isExpanded ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600 rounded-lg flex items-center justify-center text-xs font-semibold text-white">
                  ES
                </div>
                <div>
                  <p className="font-medium text-gray-900">Current Profile</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600 rounded-lg flex items-center justify-center text-xs font-semibold text-white mx-auto">
                ES
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-2 overflow-y-auto no-scrollbar">
            <div className={`${isExpanded ? 'space-y-2' : 'space-y-6'}`}>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    item.active && `bg-gradient-to-r from-blue-500 to-violet-500 p-2 mx-auto rounded-lg ${isExpanded ? 'w-full' : 'w-fit'}`
                  )}
                >
                  <button
                    className={cn(
                      'transition-all duration-200 text-left cursor-pointer',
                      isExpanded
                        ? 'w-full flex items-center space-x-3 px-3 py-2 rounded-lg'
                        : 'w-6 h-6 rounded-lg flex items-center justify-center mx-auto',
                      isExpanded
                        ? 'text-gray-700 bg-gray-100 hover:text-gray-900'
                        : 'text-gray-500 bg-gray-100 hover:text-gray-700',
                      item.active ? 'bg-white/30 text-white hover:text-white' : 'bg-gray-100'
                    )}
                    title={isExpanded ? item.label : item.label}
                  >
                    <item.icon size={14} className={`${item.active ? 'text-white' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Expand/Collapse Button - Positioned on the side */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'absolute cursor-pointer -right-3 top-[3.275rem] w-6 h-6 border-2 shadow-lg border-gray-400/40 bg-white/10 backdrop-blur-sm rounded-full shrink-0 flex items-center justify-center text-gray-600 transition-colors z-10'
          )}
        >
          {isExpanded ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar; 