import React, { useEffect, useState } from 'react';
import { Box, Toolbar, AppBar, Typography, CssBaseline, CircularProgress } from '@mui/material';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Cookies from 'js-cookie';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ role: null, token: null });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const userRole = Cookies.get('user-role');
    const jwtToken = Cookies.get('jwt');
    const project = localStorage.getItem('selectedProject');

    if (!userRole || !jwtToken) {
      navigate('/');
    } else {
      setUser({ role: userRole, token: jwtToken });
      setSelectedProject(project);
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user.role || !user.token) {
    return <Navigate to="/" />;
  }

  if (user.role !== 'admin' && !selectedProject && location.pathname !== '/select-project') {
    return <Navigate to="/select-project" />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GPDI : Project Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {location.pathname === "/dashboard" && (
          user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
