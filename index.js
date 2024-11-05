dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import candidateRoutes from './Candidate/routes/candidateRoute.js';
import companyRoutes from './CompanyHR/routes/companyRoute.js'; 
import superHRRoutes from './SuperHr/routes/superHrRoutes.js';
import hiringManagerRoutes from './HiringManager/routes/hiringManagerRoutes.js';

const app = express();
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

    app.get ('/' ,(req,res)=> {
        res.send('welcome to User API');
    })
// Routes for Candidates and Companies
app.use('/api/candidates', candidateRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/super-hr', superHRRoutes);
app.use('/api/hiring-managers', hiringManagerRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at =>  http://localhost:${PORT}`));