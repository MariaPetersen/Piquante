const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const userRoutes = require("./routes/user.js")

const app = express();

app.use(express.json())

dotenv.config();

const MONGO = process.env.MONGO_PASSWORD;

const database = (module.exports = () => {
    try{
        mongoose.connect(`mongodb+srv://maupetersen:${MONGO}@cluster0.d08vkqb.mongodb.net/?retryWrites=true&w=majority`, 
            {useNewUrlParser: true,
            useUnifiedTopology: true}
        );
    console.log('Connexion à MongoDB réussie !')
    } catch(error){
        console.log(error);
        console.log('Connexion à MongoDB échouée !')
    }
});

database();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/auth', userRoutes);

module.exports = app;



