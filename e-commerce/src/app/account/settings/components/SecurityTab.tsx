import React from 'react';

interface SecurityTabProps {
  isSaving: boolean;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ isSaving }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sécurité</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe actuel
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Conseils de sécurité</h3>
        <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
          <li>Utilisez un mot de passe d&apos;au moins 8 caractères</li>
          <li>Incluez des lettres majuscules et minuscules, des chiffres et des caractères spéciaux</li>
          <li>Ne réutilisez pas un mot de passe que vous utilisez sur d&apos;autres sites</li>
          <li>Changez régulièrement votre mot de passe pour une sécurité optimale</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityTab;
