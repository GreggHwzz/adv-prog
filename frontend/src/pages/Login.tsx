"use client"

import { useState } from 'react';
//import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
const [role, setRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT' | null>(null);
  //const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (userRole: 'ADMIN' | 'TEACHER' | 'STUDENT') => {
    try {
      // Simule la connexion de l'utilisateur avec un rôle
      const user = { id: '1', email: 'test@example.com', role: userRole, name: 'Test User' };
      if (user) {
        navigate(`/${userRole.toLowerCase()}`);
      }
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
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/img/logo.png" alt="Efrei logo" className="mx-auto w-80 mb-4" />
          <h1 className="text-5xl font-bold text-[#1E0E62]">Connexion</h1>
        </div>
        <div className="space-y-4">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogin("ADMIN")}
          >
            Admin
          </button>
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogin("TEACHER")}
          >
            Professeur
          </button>
          <button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogin("STUDENT")}
          >
            Élève
          </button>
        </div>
        <div className="mt-4 text-center text-gray-500">
            Identifiants oubliés ? 
          <a href="/forgot-password" className="text-sm text-[#37A3E5] hover:underline">
            Contactez le +33 188 289 250
          </a>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;