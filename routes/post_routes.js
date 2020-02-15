const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');
const controller = require("../controller/controller");


router.post("/saveData", async (req, res) => {    
    req.body.user = req.session.name;
    const msg = await controller.dbPost(req.body);    
    res.send(msg);
});

router.post("/delete", async (req, res) => {        
    const msg = await controller.dbDel(req.body);        
    res.send(msg);
});

router.post("/registerUser", async (req, res) => {    
    const msg = await controller.addUser(req.body);    
    res.send(msg);
});

router.post("/getToken", async (req, res) => {        
    const msg = await controller.genToken(req.body);
    res.send(msg); 
});

router.post("/verifyToken", async (req, res) => {            
    const msg = await controller.verifyToken(req.body);
    if(msg.id){
        req.session.name = msg.id;
        res.send({status: true});
    } else {
        req.session.name = "";
        res.send({status: false});
    }
});

router.post("/pwdChange", async (req, res) => { 
    const creds = req.body;
    creds.id = req.session.name
    const msg = await controller.changePwd(creds);
    if(msg)
        res.send(msg);
    else
        res.send({msg: false});
    
});

router.post("/login", async (req, res) => {    
    const msg = await controller.verifyCredentials(req.body);
    if(msg.status)        
        req.session.name = msg.id; 
    else
        req.session.destroy();
    res.send(msg);
});

module.exports = router;