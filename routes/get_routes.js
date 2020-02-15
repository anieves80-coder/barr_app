const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');
const controller = require("../controller/controller");

function mustBeLoggedIn(req, res, next){    
    if(req.session.name)
        return next();
    else    
        res.render("index");
}

router.get("/", (req, res) => {    
    res.render("index");    
});

router.get("/changePassword", mustBeLoggedIn, (req, res) => {
    res.render("passwordChange");    
});

router.get("/passwordReset", (req, res) => {    
    res.render("recover");    
});

router.get("/verifyLogin", (req, res) => {
    if(req.session.name)       
        res.send({status: true});    
    else
        res.send({status: false});
});

router.get("/saved", mustBeLoggedIn, (req, res) => {    
    res.render("saved");    
});

router.get("/register", (req, res) => {            
    res.render("register");    
});

//Random search.
router.get("/search", async (req, res) => {
    const drinkData =  await controller.getRandomDrink();    
    res.json(drinkData.data.drinks[0]);    
});

//Gets every record in the database
router.get("/searchAll", async(req, res) => {
    const savedDrinkData = await controller.dbSearchAll(req.session.name);     
    res.json(savedDrinkData);    
});

// Searches by ID
router.get("/searchOne/:id", async (req, res) => {
    const dataCall = await controller.getDrinkByID(req.params.id);
    res.json(dataCall.data.drinks[0]);    
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("index");    
});


module.exports = router;