require("dotenv").config();
const express=require('express');
const cors=require('cors');
const app=express();
const aiRoutes=require('./routes/airoutes')

const port=3000;
app.use(cors());
app.use(express.json());

app.use('/ai',aiRoutes);

app.listen(port,()=>console.log(`Server running on port ${port}`));