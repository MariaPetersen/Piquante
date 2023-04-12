const Sauce = require('../models/sauce.js')
const multer = require('multer');
const mongoose = require('mongoose')
const express = require('express');
const sauce = require('../models/sauce.js');


exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
}; 

exports.getOneSauce = (req, res, next) => {
    Sauce.findById(req.params.id)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    console.log(sauceObject.name);
    const sauce = new Sauce({
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0, 
        dislikes: 0, 
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
        .then(() => {res.status(201).json({message: "Sauce enregistrée"})})
        .catch((error) => {res.status(400).json({error})})
}

exports.updateSauce = (req, res, next) => {
    const filter = {_id: req.params.id}
    if (req.body.sauce) {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._userId;
        Sauce.updateOne(filter, {
            ...req.body,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
        .then(() => res.status(200).json({message: "Sauce mise à jour"}))
        .catch((error) => res.status(400).json({error}))
    }else{
        delete req.body.userId;
        Sauce.updateOne(filter, { 
            ...req.body,
            userId: req.auth.userId,
    })
            .then(() => res.status(200).json({message: "Sauce mise à jour"}))
            .catch((error) => {(error)})
    }
}

exports.deleteSauce = (req, res, next) => {
    const filter = {_id: req.params.id}
    Sauce.deleteOne(filter)
        .then(() => res.status(200).json({message: 'Sauce supprimée'}))
        .catch((error) => res.status(400).json({error}))
}



exports.likeSauce = (req, res, next) => {
    const filter = {_id: req.params.id}
    const like = req.body.like

    if (like === 1){
        Sauce.updateOne(filter, {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId}
        })
            .then(() => res.status(200).json({message: "Like ajouté"}))
            .catch((error) => res.status(400).json({error}))
    } 
    else if (like === 0){
        Sauce.updateOne(
            {
                _id: req.params.id, 
                usersLiked: {$in: req.body.userId}
            }, 
            {
                $inc: {likes: -1},
                $pull: {usersLiked: req.body.userId}
            })
            .then(
                Sauce.updateOne(
                    {
                        _id: req.params.id,  
                        usersDisliked: {$in: req.body.userId}
                    }, 
                    {
                        $inc: {dislikes: -1},
                        $pull: {usersDisliked: req.body.userId}
                    })
                    .then(() => res.status(200).json({message: "Like ou dislike enlevé"}))
                    .catch((error) => res.status(400).json({error}))
            )
                
        }
    //     else if (like === 0){

    //     Sauce.updateOne(
    //         {
    //             _id: req.params.id,  
    //             usersDisliked: {$in: req.body.userId}
    //         }, 
    //         {
    //             $inc: {dislikes: -1},
    //             $pull: {usersDisliked: req.body.userId}
    //         })
    //             .then(() => res.status(200).json({message: "Dislike enlevé"}))
    //             .catch((error) => res.status(400).json({error}))
    // }  
    else if (like === -1) {
        Sauce.updateOne(filter, {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId}
        })
        .then(() => res.status(200).json({message: "Dislike ajouté"}))
        .catch((error) => res.status(400).json({error}))
    }

}