'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/api'; // Import de l'API d'authentification

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      // Préparation des données pour l'API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      
      // Appel à l'API d'inscription
      await api.auth.register(userData);
      
      // Afficher un message de succès
      setSuccess(true);
      
      // Redirection vers la page de connexion après un délai
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      // Afficher le message d'erreur de l'API ou un message par défaut
      setError(err.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="enspy-container max-w-md mx-auto">
          <div className="card p-8 shadow-md">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4 primary-text">Inscription réussie !</h1>
              <p className="mb-6 text-gray-600">
                Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter avec vos identifiants.
              </p>
              <Link href="/auth/login" className="btn btn-primary inline-block">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="enspy-container max-w-md mx-auto">
        <div className="card p-8 shadow-md">
          <div className="flex justify-center mb-6">
            <div className="relative h-16 w-16">
              <Image 
                src="/images/enspy.jpg" 
                alt="Logo ENSPY" 
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-center primary-text">Créer un compte</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="label">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="label">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                minLength={8}
              />
              <p className="text-sm text-gray-600 mt-1">
                Le mot de passe doit contenir au moins 8 caractères.
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="/terms-of-service" className="text-primary hover:underline">
                Conditions d&apos;utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
