import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminName: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adminName,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm" hideHeader={true}>
      <div className="p-6">
        <div className="flex items-start space-x-3 p-4 rounded-lg border bg-red-50 border-red-200">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{' '}
              <span className="font-bold text-gray-900">{adminName}</span>? 
              This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 