require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://admin:pass1234@cluster0.vr4jl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('Connected',()=>{
    console.log("connected to mongo db");
});

mongoose.connection.on('Error',(err)=>{
    console.error("error connecting",err);
});

app.get('/', requireAuth , (req,res) => {
    res.send(`Your Email: ${req.user.email}`);
});

app.listen(3000,() =>{
    console.log("listening on port 3000");
});