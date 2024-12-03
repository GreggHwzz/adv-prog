"use client"

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/Login';
import StudentDashboard from '@/pages/student/Dashboard';
import TeacherDashboard from '@/pages/teacher/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/student/dashboard',
    element: <StudentDashboard />,
  },
  {
    path: '/teacher/dashboard',
    element: <TeacherDashboard />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
]);

const RouterApp = () => {
  //const { user, loading } = useAuth();

  //if (loading) {
    //return <div>Loading...</div>;
  //}

  return <RouterProvider router={router} />;
};

export default RouterApp;