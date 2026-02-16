import express from 'express';
import userRoutes from './routes/userRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import obstacleRoutes from './routes/obstacleRoutes.js';
import stopPointRoutes from './routes/stopPointRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import pathRoutes from './routes/pathRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/obstacles', obstacleRoutes);
app.use('/api/stoppoints', stopPointRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/paths', pathRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API CRUD y Path Finder funcionando',
    endpoints: {
      users: '/api/users',
      maps: '/api/maps',
      obstacles: '/api/obstacles',
      stopPoints: '/api/stoppoints',
      routes: '/api/routes',
      path: '/api/path'
    }
  });
});

export default app;