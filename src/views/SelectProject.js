import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import Cookies from 'js-cookie';

const SelectProject = () => {
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
        console.error('Error fetching roles and projects:', error);
        setLoading(false);
      }
    };

    fetchRolesAndProjects();
  }, []);

  const handleSelectProject = (projectId) => {
    localStorage.setItem('selectedProject', projectId);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Seleccionar Proyecto</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Roles y Equipos</Typography>
          <Box>
            {roles.map((role) => (
              <Typography key={role._id}>{role.name}</Typography>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Proyectos</Typography>
          <Box>
            {projects.map((project) => (
              <Button key={project._id} onClick={() => handleSelectProject(project._id)} variant="contained" sx={{ mb: 1, mr: 1 }}>
                {project.nombre}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SelectProject;
