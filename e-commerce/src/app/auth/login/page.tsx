'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/api'; // Import de l'API d'authentification

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation simple côté client pour éviter des appels API inutiles
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }

    try {
      // Appel à l'API d'authentification
      await api.auth.login(email, password);
      
      // Les tokens et informations utilisateur sont déjà stockés dans l'API
      
      // Émettre un événement personnalisé pour informer la barre de navigation
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('login'));
      }
      
      // Redirection vers la page d'accueil après connexion réussie
      router.push('/');
    } catch (error: unknown) {
      // Afficher le message d'erreur de l'API ou un message par défaut
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      
      if (errorMessage.includes('email must be an email')) {
        setError('Format d\'email invalide. Veuillez entrer une adresse email valide.');
      } else {
        setError(errorMessage || 'Identifiants incorrects. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          
          <h1 className="text-3xl font-bold mb-6 text-center primary-text">Connexion</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous n&apos;avez pas de compte ?{' '}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                S&apos;inscrire
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Accès réservé aux membres de l&apos;ENSPY connectés au réseau Wi-Fi de l&apos;école.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
