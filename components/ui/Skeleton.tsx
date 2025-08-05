import React from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
    />
  );
};

// Table row skeleton - updated to match actual table structure
export const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-3 sm:px-6 py-4">
      <Skeleton className="w-4 h-4" />
    </td>
    <td className="px-3 sm:px-6 py-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </td>
    <td className="px-3 sm:px-6 py-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="h-6 w-16" />
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-6 h-6 rounded-lg" />
        <Skeleton className="h-4 w-20" />
      </div>
    </td>
    <td className="hidden lg:table-cell px-6 py-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </td>
    <td className="hidden lg:table-cell px-6 py-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </td>
    <td className="px-3 sm:px-6 py-4">
      <div className="flex space-x-2">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-6 h-6" />
      </div>
    </td>
  </tr>
);

// Table skeleton for use outside of table structure - updated to match actual layout
export const TableSkeletonStandalone: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
          <Skeleton className="w-4 h-4" />
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="hidden lg:flex space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="hidden lg:flex space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Summary card skeleton - updated to match actual summary card structure
export const SummaryCardSkeleton: React.FC = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Admin detail skeleton - new component for AdminDetail view
export const AdminDetailSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-white shadow-xl rounded-xl p-4 gap-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Profile Summary skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <Skeleton className="h-5 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-40 mx-auto sm:mx-0" />
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics skeleton */}
        <Card>
          <CardHeader className='px-6 pt-6 pb-0'>
            <CardTitle className='font-bold text-sm text-gray-900'>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6 col-span-1 lg:col-span-2">
        {/* Assigned Societies skeleton */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pt-6 pb-0 gap-4">
            <CardTitle className='font-bold text-sm text-gray-900'>Assigned Societies</CardTitle>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
                <Skeleton className="w-4 h-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities skeleton */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pt-6 pb-0 gap-4">
            <CardTitle className='font-bold text-sm text-gray-900'>Recent Activities</CardTitle>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-gray-50/40 border border-gray-50">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2 w-32" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Activity item skeleton - for modal content
export const ActivityItemSkeleton: React.FC = () => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50/40 border border-gray-50">
    <Skeleton className="w-8 h-8 rounded-full" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

// Form skeleton - for AdminForm loading state
export const FormSkeleton: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div className="space-y-6">
          {/* Personal Information skeleton */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Society Assignments skeleton */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="relative">
              <Skeleton className="h-10 w-full" />
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Skeleton className="w-4 h-4" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions skeleton */}
          <div>
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Society dropdown skeleton - for society loading state
export const SocietyDropdownSkeleton: React.FC = () => (
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Skeleton className="w-4 h-4" />
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Card skeleton - updated to match actual card structure
export const CardSkeleton: React.FC = () => (
  <div className="p-4">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRowSkeleton key={index} />
    ))}
  </>
);

export { Skeleton }; 