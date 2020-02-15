const model = require("../model/model");
const axios = require("axios");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = {

    dbPost: async (data) => {
        const msg = await model.dbSaveDrink(data);        
        return msg;
    },
    dbDel: async (data) => {
        const msg = await model.dbDelDrink(data);      
        return msg;
    },
    dbSearchAll: async (id) => {
        const data = await model.dbSearchAllDrinks(id);        
        return data;
    },
    getRandomDrink: async () => {
        const res = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');        
        return res;           
    },
    getDrinkByID: async (id) => {
        const res = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        return res;
    },
    addUser: async (data) => {
        const hashedPwd = await hashPwd(data.pwd);        
        const unique = await verifyUnique(data.email);         
        data.pwd = hashedPwd;               
        if(unique){            
            const msg = await model.dbUserAdd(data);
            return msg;
        } return {status: "Email already in record"};
    },
    verifyCredentials: async (creds) => {        
        const res = await model.dbUserFindbyEmail(creds.email);
        const ver = await comparePwd(creds.pwd, res[0].pwd);        
        return {status: ver, id:res[0]._id};
    },
    genToken: async (data) => {        
        const exists = await model.dbUserFindbyEmail(data.email);
        if(exists.length > 0){
            data.token = `${(Math.floor(Math.random() * 503) + 25) * 1365}`;           
            const msg = await model.dbUserAddToken(data);            
            if(msg){
                sendEmail(data.email, data.token);
                return {msg};
            }
        } else {
            return {msg:false};
        }        
    },
    verifyToken: async (data) => {
        const res = await model.dbUserVerifyToken(data);
        if(res){
            return {id:res._id};
        } else {            
            return {status:"N/A"}
        }
    }, changePwd: async (data) => {
        const hashedPwd = await hashPwd(data.pwd);
        data.pwd = hashedPwd;
        const msg = await model.dbUserChngPwd(data);  
        return {msg};
    }
    
}

//Makes a call to the database to see if there is already a 
//record in the db with the email passed.
async function verifyUnique(email){    
    const res = await model.dbUserFindbyEmail(email);     
    if(res.length > 0)    
        return false;
    return true;
}

//Hashes the pwd and returns it with a promise.
function hashPwd(pwd){
    return new Promise( (resolve, reject) => {
        bcrypt.hash(pwd, 10, (err, hash) => {     
            if(err)
				reject();   
            resolve(hash);
          });
    });
}

//Compares the pwd with the hashed pwd in the db
//returns true is they match otherwise it returns false
function comparePwd(pwd,hash){   
    return new Promise( (resolve, reject) => {
        bcrypt.compare(pwd, hash, function(err, res) {
            res ? resolve(true) : resolve(false);            
        });
    });
}

//Generates and sends an email with the verification code
//to change the password.
function sendEmail(email, token){
    
    const myEmail = 'BarApplicationService@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${myEmail}`,
          pass: 'yellowamerican'
        }
      });
      
      const mailOptions = {
        from: `${myEmail}`,
        to: email,
        subject: 'Bar App password token.',
        text: `Thank you for using the Bar App. Your temporary code to reset your password is ${token}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}
