import React from 'react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  noResultsMessage?: string;
  hasResults?: boolean;
  hasSearch?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  noResultsMessage = '',
  hasResults = true,
  hasSearch = false
}) => {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {showInfo && (
        <p className="text-xs text-gray-700 font-medium text-center sm:text-left">
          {!hasResults && hasSearch ? (
            noResultsMessage
          ) : (
            `Showing ${startItem} - ${endItem} of ${totalItems} admins`
          )}
        </p>
      )}
      
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="text-xs font-medium h-6 px-2"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {(() => {
              const pages = [];

              // Always show first page
              if (currentPage > 3) {
                pages.push(
                  <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    className="px-2.5 h-6 text-xs font-medium rounded-lg"
                  >
                    1
                  </Button>
                );
                if (currentPage > 4) {
                  pages.push(
                    <span key="ellipsis1" className="px-2 text-gray-400">...</span>
                  );
                }
              }

              // Show pages around current page
              const start = Math.max(1, currentPage - 1);
              const end = Math.min(totalPages, currentPage + 1);

              for (let i = start; i <= end; i++) {
                if (i === currentPage) {
                  pages.push(
                    <Button
                      key={i}
                      variant="default"
                      size="sm"
                      className="px-2.5 h-6 text-xs font-medium rounded-lg"
                    >
                      {i}
                    </Button>
                  );
                } else {
                  pages.push(
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(i)}
                      className="px-2.5 h-6 text-xs font-medium rounded-lg"
                    >
                      {i}
                    </Button>
                  );
                }
              }

              // Always show last page
              if (currentPage < totalPages - 2) {
                if (currentPage < totalPages - 3) {
                  pages.push(
                    <span key="ellipsis2" className="px-2 text-gray-400">...</span>
                  );
                }
                pages.push(
                  <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    className="px-2.5 h-6 text-xs font-medium rounded-lg"
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="text-xs font-medium h-6 px-2"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pagination; 