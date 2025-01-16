"use client"

import { useState } from 'react';
//import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import des icônes pour l'œil


const LoginPage = () => {
  //const [role, setRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT' | null>(null);
  //const { signIn } = useAuth();
  const navigate = useNavigate();

  const users = [
    { role: "ADMIN", email: "admin@example.fr", password: "admin123", name: "Admin User" },
    { role: "TEACHER", email: "teacher@example.fr", password: "teacher123", name: "Teacher User" },
    { role: "STUDENT", email: "student@example.fr", password: "student123", name: "Student User" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe


  const handleLogin = async () => {
    try {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        alert("Email ou mot de passe incorrect !");
        return;
      }

      // Redirige vers le tableau de bord correspondant au rôle
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error(error);
    }
  };
  /*const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { user } = await signIn(email, password);
      if (user) {
        // Rediriger l'utilisateur vers la page d'accueil appropriée selon son rôle
        if (user.role === 'STUDENT') {
          navigate('/student');
        } else if (user.role === 'TEACHER') {
          navigate('/teacher');
        } else if (user.role === 'ADMIN') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };*/

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/img/background.jpg')" }}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/img/logo.png" alt="Efrei logo" className="mx-auto w-80 mb-4" />
          <h1 className="text-5xl font-bold text-[#1E0E62]">Connexion</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Basculer entre texte et mot de passe
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Basculer l'état
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icône pour afficher/masquer */}
              </button>
            </div>
          </div>
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
