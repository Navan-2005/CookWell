require("dotenv").config();
const express=require('express');
const cors=require('cors');
const app=express();
const aiRoutes=require('./routes/airoutes')
const userRoutes=require('./routes/userRoutes')
require("dotenv").config();
const connectDB=require('./db/db')
connectDB();

const port=3000;
app.use(cors());
app.use(express.json());

app.use('/ai',aiRoutes);
app.use('/user',userRoutes);

app.listen(port,()=>console.log(`Server running on port ${port}`));