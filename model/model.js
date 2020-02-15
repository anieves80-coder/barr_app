const mongojs = require('mongojs');

const databaseUrl = "mongodb://localhost:39523/heroku_t0dv08n5";
const collections = [ 'usersData', 'savedData' ]; 
const db = mongojs(databaseUrl, collections);

db.on('error', (error) => {
	console.log('Database Error:', error);
});

module.exports = {	
	dbSearchAllDrinks: (id) => {		
		return new Promise( (resolve, reject) => {
			db.savedData.find({"user":id}, (err, result) => {
				if(err)
					reject();								
				resolve(result);
			});
		});		
	},
	dbSaveDrink: (data) => {				
		return new Promise( (resolve, reject) => {
			db.savedData.update({"drinkId":data.drinkId},{$set:data},{ upsert : true }, (err, result) => {
				if(err)
					reject();								
				resolve({status: "OK"});
			});
		});	
	},
	dbDelDrink: (data) => {			
		return new Promise( (resolve, reject) => {
			db.savedData.remove({"_id": mongojs.ObjectId(data.id)}, (err, result) => {
				if(err)
					reject();								
				resolve({status: "OK"});
			});
		});
	},
	dbUserAdd: (data) => {
		data.token = '';			
		return new Promise( (resolve, reject) => {
			db.usersData.insert(data, (err, result) => {
				if(err)
					reject();								
				resolve({id: result._id, status:"ok"});
			});
		});
	},
	dbUserDel: (data) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.remove({"_id": mongojs.ObjectId(data.id)}, (err, result) => {
				if(err)
					reject();								
				resolve({status: "Deleted"});
			});
		});
	},
	dbUserFindbyEmail: (email) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.find({email}, (err, result) => {
				if(err)
					reject();								
				resolve(result);
			});
		});
	},
	dbUserFindbyId: (id) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.find({"_id": mongojs.ObjectId(id)}, (err, result) => {
				if(err)
					reject();								
				resolve(result);
			});
		});
	},
	dbUserAddToken: (data) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.update({"email":data.email},{$set:{"token":data.token}}, (err, result) => {
				if(err)
					reject();								
				resolve(true);
			});
		});
	},
	dbUserVerifyToken: (data) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.findOne({$and:[{"email":data.email},{"token":data.token}]}, (err, result) => {
				if(err)
					reject();								
				resolve(result);
			});
		});
	},
	dbUserChngPwd: (data) => {			
		return new Promise( (resolve, reject) => {
			db.usersData.update({"_id":mongojs.ObjectId(data.id)},{$set:{"pwd":data.pwd}}, (err, result) => {							
				if(err)
					reject();								
				resolve(true);
			});
		});
	},
};






