import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button, CircularProgress, Paper, Avatar, CssBaseline, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const theme = createTheme();

const SelectProject = () => {
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRolesAndProjects = async () => {
      try {
        const rolesResponse = await axios.get(`${config.API_URL}/roles`, { withCredentials: true });
        const projectsResponse = await axios.get(`${config.API_URL}/proyectos`, { withCredentials: true });
        setRoles(rolesResponse.data.data);
        setProjects(projectsResponse.data.data);
        setLoading(false);
      } catch (error) {
        setSnackbarMessage('Error fetching roles and projects');
        setSnackbarOpen(true);
        setLoading(false);
      }
    };

    fetchRolesAndProjects();
  }, []);

  const handleSelectProject = (projectId) => {
    localStorage.setItem('selectedProject', projectId);
    navigate('/dashboard');
  };

  const handleRoleClick = (roleId) => {
    setSelectedRole(roleId);
  };

  const filteredProjects = selectedRole ? projects.filter(project => project.roleId === selectedRole) : projects;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: '#1976d2', color: '#fff', p: 2, mb: 4 }}>
          <Typography variant="h4">GPDI : Project Management System</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box mb={2} textAlign="center">
                <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h6">2 3</Typography>
                <Typography variant="body2">13@gmail.com</Typography>
                <Typography variant="body2">admin</Typography>
              </Box>
              <Typography variant="h6">Roles y Equipos</Typography>
              <Box>
                {roles.map((role) => (
                  <Button
                    key={role._id}
                    onClick={() => handleRoleClick(role._id)}
                    variant={selectedRole === role._id ? "contained" : "outlined"}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>{role.name[0]}</Avatar>
                      {role.name}
                    </div>
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h6" gutterBottom>Proyectos</Typography>
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{project.nombre}</Typography>
                    <Button
                      onClick={() => handleSelectProject(project._id)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      Seleccionar
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default SelectProject;
