
$("#searchBtn").hide();
$("#navMsg").html("<i class='fas fa-book-open'> Your saved drink(s).");
$("#savedLink").addClass("disabled");
$("#loginLink").html('<i class="fas fa-sign-in-alt"></i> Logout');
//$("#loginLink").addClass("disabled");

// Gets all the saved data whenever the page loads.
$.get('/searchAll').then(function(data) {
    displaySavedDrink(data);			        
});

// Sets the stars rating.
function setSavedStars(cnt){
    
    const res = [];    
    for(let i = 0; i < 5; i++ ){
        if(i < cnt)
            res.push(`<span class="fa fa-star checked"></span>`);
        else
            res.push(`<span class="fa fa-star"></span>`);

    }    
    return res.join("");
}

const displaySavedDrink = (data) => {    

    const dataArray = [];

    //Sets the object data into an array.
    const objArr = Object.values(data); 

    //Divides objArr into arrays of 4 values.
    for(let x = 0; x < objArr.length; x++){ 
        dataArray.push(objArr.splice(0,4));
    }
    //Adds the remainder objects into dataArray.
    if(objArr)
        dataArray.push(objArr);
    
    // Loops over array and sets the HTML with the data in the database.
    for(let i = 0; i < dataArray.length; i++){ 
        $("#savedData").append(`<div class="row mb-2" id="box${i}"><div class="card-group">`);
        for(let x = 0; x < dataArray[i].length; x++){ 
            $(`#box${i}`).append(`                    
                <div class="col-lg-3">                
                    <div class="card">
                        <img src="${dataArray[i][x].imgURL}" class="card-img-top" alt="No image available.">
                        <div class="card-body">
                            <u>
                                <a href="javascript:void(0)" class="font-weight-bold aDrinkNames text-dark" id="${dataArray[i][x].drinkId}" data-rating="${dataArray[i][x].starRating}" data-comment="${dataArray[i][x].comments}">${dataArray[i][x].drinkName}</a>
                            </u>     
                            <p></p>                           
                            <!-- <p class="card-text font-italic">${dataArray[i][x].comments}</p> //uncomment to allow the comments to appear. --> 
                            <div class="row">
                                <div class="col-7">
                                    ${setSavedStars(parseInt(dataArray[i][x].starRating))}
                                </div>
                                <div class="col">
                                    <a class="" href=""><small class="font-weight-bold delLink text-danger" id=${dataArray[i][x]._id}>Delete</small></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            `);                  
        }
    }        
}

// Gets executed whenever the client clicks on the delete link.
// Removes the drink from the saved entry in the database.
$("#savedData").on("click",".delLink", function(){
    const data = { id: $(this).attr("id") };
    $.post("/data/delete", data, function(resData){        
        if(resData.status === "OK")
            location.reload();
    });    
});

// Gets executed whenever the client clicks on the drink title.
// Grabs all the data needed and stores it in sessionStorage.
// Its used to retrieve the specific drink info whenever the
// the client gets redirected to the search page.
$("#savedData").on("click",".aDrinkNames", function(){ 
   
    const drinkInfo = {
        drinkId: $(this).attr("id"),
        rating: $(this).attr("data-rating"),
        comments: $(this).attr("data-comment")
    }
    sessionStorage.setItem("savedDrinkInfo", JSON.stringify(drinkInfo));
    window.location.href = `/?info=savedDrinkInfo`;   
});

//Calls the login modal if not logged in.
//If logged in then logs the client out.
$("#loginLink").on("click", function(){	
	$.get("/logout");
	window.location.href = `/`;	
});

