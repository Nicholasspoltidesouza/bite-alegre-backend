import cors from 'cors';
import express from 'express';

import authRoutes from './routes/auth-routes.js';
import checkinRoutes from './routes/checkin-route.js';
import feedRoutes from './routes/feed-routes.js';
import openingHourRoutes from './routes/opening-hour-routes.js';
import publicationRoutes from './routes/publication-route.js';
import restaurantRoutes from './routes/restaurant-routes.js';
import reviewRoutes from './routes/review-route.js';
import tagRoutes from './routes/tag-routes.js';
import userPreferencesRoutes from './routes/user-preferences-routes.js';
import userRoutes from './routes/user-routes.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api', restaurantRoutes);
app.use('/api', openingHourRoutes);
app.use('/api', userRoutes);
app.use('/api', tagRoutes);
app.use('/api', userPreferencesRoutes);
app.use('/api', checkinRoutes);
app.use('/api', reviewRoutes);
app.use('/api', authRoutes);
app.use('/api', feedRoutes);
app.use('/api', publicationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
