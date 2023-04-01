const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const app = express();

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

app.use((req, res) => {
    res.json({ message:"Voilà votre nouveau serveur"})
});

module.exports = app;



