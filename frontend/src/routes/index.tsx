"use client"

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/Login';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentHistory from '@/pages/student/History';
import TeacherDashboard from '@/pages/teacher/Dashboard';
import TeacherEvaluations from '@/pages/teacher/Evaluations';
import TeacherStats from '@/pages/teacher/Stats';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminForms from '@/pages/admin/Forms';
import AdminAnalytics from '@/pages/admin/Analytics';
import AdminSettings from '@/pages/admin/Settings';

const roleBasedRoutes = {
  student: [
    { path: "/student/dashboard", element: <StudentDashboard /> },
    { path: "/student/history", element: <StudentHistory /> },
  ],
  teacher: [
    { path: "/teacher/dashboard", element: <TeacherDashboard /> },
    { path: "/teacher/evaluations", element: <TeacherEvaluations /> },
    { path: "/teacher/stats", element: <TeacherStats /> },
  ],
  admin: [
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/users", element: <AdminUsers /> },
    { path: "/admin/forms", element: <AdminForms /> },
    { path: "/admin/analytics", element: <AdminAnalytics /> },
    { path: "/admin/settings", element: <AdminSettings /> },
  ],
};

// Regroupement des routes
const routes = [
  { path: "/", element: <LoginPage /> },
  ...roleBasedRoutes.student,
  ...roleBasedRoutes.teacher,
  ...roleBasedRoutes.admin,
];

const router = createBrowserRouter(routes);

const RouterApp = () => {
  //const { user, loading } = useAuth();

  //if (loading) {
    //return <div>Loading...</div>;
  //}

  return <RouterProvider router={router} />;
};

export default RouterApp;
