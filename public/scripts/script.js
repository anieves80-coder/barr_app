let drinkId = 0;
let starRating = 1;
let imgURL = '';
let drinkName = '';

$(document).ready(function() {

	$('#drinkImg').attr('src', '../img/loading.gif');
	const myURL = window.location.href;
	const drinkInfo = JSON.parse(sessionStorage.getItem( myURL.split('=')[1] ));
	
	$("#searchLink").addClass("disabled");
	$("#savedLink").addClass("disabled");
	$("#saveBtn").addClass("disabled");
	$("#searchLink2").addClass("disabled");
	$("#savedLink2").addClass("disabled");
	$("#saveBtn2").addClass("disabled");

	$.get("/verifyLogin", function(res){		
		if(res.status){
			$("#savedLink").removeClass("disabled");
			$("#saveBtn").removeClass("disabled");
			$("#loginLink").html('<i class="fas fa-sign-in-alt"></i> Logout');
			$("#savedLink2").removeClass("disabled");
			$("#saveBtn2").removeClass("disabled");
			$("#loginLink2").html('<i class="fas fa-sign-in-alt"></i> Logout');
		}
	});
	
	if(drinkInfo){
		$.get(`/searchOne/${ drinkInfo.drinkId }`).then(function(data){					
			displayDrink(data, drinkInfo.comments);				
			setStars(parseInt(drinkInfo.rating));
		});
	} else {
		$.get('/search').then(function(data) {
			displayDrink(data);			
		});
	}

	$("#loginModalForm").submit(function(event){
		event.preventDefault();
		const creds = {
			email: $("#loginEmail").val().trim(),
			pwd: $("#loginPassword").val().trim()
		}
		$.post("/data/login", creds).then(function(res){
			if(res.status)
				window.location.href = "/";
			else	
				$("#loginModalErr").text("Invalid login credentials.");
		});
	});
});

const displayDrink = (data, comm = "") => {

	drinkId = data.idDrink;	
	imgURL = data.strDrinkThumb;
	drinkName = data.strDrink;

	$("#comments").val(comm)	
	$('#drinkImg').attr('src', imgURL);	
	$('#drinkInfo').empty();
	$('#drinkInfo').append(`
		<div id="drinkName" class="font-weight-bold"><u><h3>${drinkName}</h3></u></div> 
	`);
	$('#drinkInfo').append(`
		<div class="row mt-5">
			<div class="col-5 col-md-3 font-weight-bold" id="cat">CATEGORY:</div>
			<div class="col font-italic">${data.strCategory}</div>
		</div>
	`);
	$('#drinkInfo').append(`
		<div class="row">
			<div class="col-5 col-md-3 font-weight-bold">GLASS TYPE:</div>
			<div class="col font-italic">${data.strGlass}</div>
		</div>
	`);
	$('#drinkInfo').append(`
		<div class="row">
			<div class="col-5 col-md-3 font-weight-bold">DRINK TYPE:</div>
			<div class="col font-italic">${data.strAlcoholic}</div>
		</div>
	`);
	$('#drinkInfo').append(`
		<div class="row">
			<div class="col-3 font-weight-bold">INGREDIENTS:</div>			
		</div>
	`);
	ingredients(data).forEach((data) => {
		$('#drinkInfo').append(`
			<div class="row text-center">${data}</div>
		`);
	});
	$('#drinkInfo').append(`
		<div class="row mt-5">
			<div class="col-5 col-lg-3 font-weight-bold mr-2">INSTRUCTIONS:</div>
			<div class="col font-italic">${data.strInstructions}</div>
		</div>
	`);

};

const ingredients = (data) => {
	const ingre = [];
	const measure = [];
	const result = [];
	
	for (let key in data) {
		if (key.substr(0, 13) === 'strIngredient') if (data[key]) ingre.push(key);
		if (key.substr(0, 10) === 'strMeasure') measure.push(key);
	}
	ingre.forEach((info, i) => {
		if (data[measure[i]])
			result.push(
				`<div class="col  text-right">${data[
					info
				]}</div>: <div class="col  text-left">${data[measure[i]]}</div>`
			);
		else
			result.push(
				`<div class="col text-right">${data[info]}</div> <div class="col"> </div>`
			);
	});

	return result;
};

// Executes whenever the search button is clicked.
// Makes a call to the back-end to search for a random drink.
$('#searchBtn,#searchBtn2').on('click', function() {	
	$('#drinkImg').attr('src', '../img/loading.gif');
	setStars(1);
	$.get('/search').then(function(data) {
		displayDrink(data);
	});
});

// Executes whenever the save button is clicked.
// Sends the info to the back-end server to save the data in a database.
$("#saveBtn,#saveBtn2").on("click", function(){
	if(!$(this).hasClass("disabled")){
		const toSave = {
			drinkId,
			drinkName,
			comments : $("#comments").val(),
			starRating,
			imgURL 
		}

		$.post("/data/saveData", toSave, function(res){
			if(res.status === "OK")
				$("#savedModal").modal("show");
			else
				alert("ERROR SAVING.");
		});
	}
	
});

/**
 * 
 *  Star ratings section.
 * 
 */
const allStars = [];

// Searches for the 'stars' div and adds all of the <span> children ID's to an array.
$('#star').find('.fa-star').each(function() {
	allStars.push(this.id);
});

// Logic that makes the clicking on a star work.
$('.fa-star').on('click', function() {
	const clicked = $(this).attr('id');
	const that = this;
	let flag = false;

	starRating = allStars.indexOf(clicked) + 1;

	allStars.forEach(function(data) {
		if (!(clicked === data) && flag === false) {
			$(that).addClass('checked');
			$(`#${data}`).addClass('checked');
		} else {
			flag = true;
			$(`#${data}`).removeClass('checked');
			$(that).addClass('checked');
		}
	});	
});

// Clears all stars then sets the number of stars from an integer passed.
function setStars(num) {	
	$('#star').find('.fa-star').each(function() {
		$(this).removeClass('checked');
	});
	for (let i = 0; i < num; i++) {
		$('#' + allStars[i]).addClass('checked');
	}
}

//Calls the login modal if not logged in.
//If logged in then logs the client out.
$("#loginLink,#loginLink2").on("click", function(){	
	$.get("/verifyLogin", function(res){		
		if(res.status){
			$.get("/logout");
			window.location.href = `/`;
		} else {
			$("#loginModal").modal("show");
		}
	});	
});
