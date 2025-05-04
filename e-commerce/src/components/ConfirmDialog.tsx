import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-transparent"
        onClick={onCancel}
      ></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden animate-modal-scale">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center space-x-6 mt-6">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 rounded-md text-white transition-colors font-medium text-sm shadow-md"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
