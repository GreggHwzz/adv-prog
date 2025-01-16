"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { signIn, user, logout } = useAuth(); // Utilisation du hook
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialiser l'erreur avant chaque tentative de connexion
  
    try {
      const { user, token,role } = await signIn(email, password); // Appeler le hook signIn
      console.log(user)
      if (user && token) {
        // Une fois l'utilisateur connecté, récupérer son profil et son rôle
        if (role) {
          console.log('Rôle de l\'utilisateur:', role);
          // Si un rôle est trouvé, rediriger l'utilisateur en fonction de son rôle
          router.push(`/${role.toString().toLowerCase()}/dashboard`);
        } else {
          // Si aucun rôle n'est trouvé, gérer l'absence de rôle
          setError("Rôle utilisateur introuvable.");
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error?.response?.data?.message || 'Erreur lors de la connexion');
    }
  };
  
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/img/logo.png" alt="Efrei logo" className="mx-auto w-80 mb-4" />
          <h1 className="text-5xl font-bold text-[#1E0E62]">Connexion</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1E0E62] hover:bg-[#3A3B5B] text-white font-bold py-2 px-4 rounded"
          >
            Connexion
          </button>
        </form>

        <div className="mt-4 text-center text-gray-500">
          Identifiants oubliés ?{" "}
          <a href="/forgot-password" className="text-sm text-[#37A3E5] hover:underline">
            Contactez le +33 188 289 250
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
