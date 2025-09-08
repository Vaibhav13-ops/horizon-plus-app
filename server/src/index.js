const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const visionBoardRoutes = require('./routes/visionBoardRoutes.js'); 
const joyLogRoutes = require('./routes/joyLogRoutes.js'); 
const aiRoutes = require('./routes/aiRoutes.js'); 
const consultantRoutes = require('./routes/consultantRoutes.js'); 
const paymentRoutes = require('./routes/paymentRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const journeyRoutes = require('./routes/journeyRoutes.js');

dotenv.config(); 
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/visionboard', visionBoardRoutes);
app.use('/api/joylog', joyLogRoutes); 
app.use('/api/coach', aiRoutes); 
app.use('/api/consultants', consultantRoutes); 
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/journeys', journeyRoutes);


const port = 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
