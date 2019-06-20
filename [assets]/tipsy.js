////
//firebase
//
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyAHvn26_J64OoAwLU5aYUX2xVBkTKapFmQ",
    authDomain: "demo2-6d127.firebaseapp.com",
    databaseURL: "https://demo2-6d127.firebaseio.com",
    projectId: "demo2-6d127",
    storageBucket: "demo2-6d127.appspot.com",
    messagingSenderId: "452640698101",
    appId: "1:452640698101:web:b99411527b09c9f8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
var database = firebase.database();


// ////
//ajax section
/////
///////

// empty ingredient array
var ingredients = [];
// empty drink array
var cocktails = [];
// empty user basket array
var drinkBasket = [];
var ingredientBasket = [];

// function for creating basket button
function renderDrinkBasket(){
    $(".genDrinkBasket").empty();
    for (var i = 0; i < drinkBasket.length; i++){
        var genDrinkBasket = $("<button>");
        genDrinkBasket.text(drinkBasket[i]);
        genDrinkBasket.addClass("user-drinkbasket");
        genDrinkBasket.attr("data-drinkbtn", drinkBasket[i]);
        $(".genDrinkBasket").append(genDrinkBasket);
    }
}

// function for creating basket button
function renderIngredientBasket(){
    $(".genIngredientBasket").empty();
    for (var i = 0; i < ingredientBasket.length; i++){
        var genIngredientBasket = $("<button>");
        genIngredientBasket.text(ingredientBasket[i]);
        genIngredientBasket.addClass("user-ingredientbasket");
        genIngredientBasket.attr("data-drinkbtn", ingredientBasket[i]);
        $(".genIngredientBasket").append(genIngredientBasket);
    }
}

// add on click event that adds drink buttons to the array
$("#add-drink").on("click", function(e){
    // empty buttons so you dont get duplicate ones
    $(".genCocktail").empty();
    // prevent form from refreshing
    e.preventDefault();
    // create variable that takes user input value
    var userDrink = $("#drink-search").val().trim();
    // push userButton to array
    cocktails.push(userDrink);
    // push to basket
    drinkBasket.push(userDrink);
    
    var recentDrink = {
        drinkRecent: userDrink,
    };
    var arrayDrink = {
        drinkSearch: userDrink,
    }
    database.ref("/recentDrink").set(recentDrink);
    database.ref("/userDrinkSearch").push(arrayDrink);
    $("#drink-search").val("");
    
    // this will populate the screen with ALL COCKTAILS that has user-input keyword
    // ex: user input = margarita, page will populate with cocktails with the name margarita on it
    var drinkQuery = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + userDrink;
  
    // ajax call
    $.ajax({
        url: drinkQuery,
        method: "GET"
    }).then(function(res){
       console.log(res);
    // console.log(res.drinks[0].strDrink)

            for(var i = 0; i < res.drinks.length; i++){
            var genCocktail = $("<button>");
            genCocktail.text(res.drinks[i].strDrink)
            genCocktail.addClass("user-drinkbtn");
            genCocktail.attr("data-drinkbtn", res.drinks[i].strDrink)
            $(".genCocktail").append(genCocktail);
     
        }
    
    });
    renderDrinkBasket();
    console.log("User Drinks: " + cocktails);
    console.log("User Drink Basket: " + drinkBasket);
})

// add on click event that adds ingredient buttons to the array
$("#add-ing").on("click", function(event){
    $(".genDrink").empty();
    // prevent form from refreshing
    event.preventDefault();
    // create variable that takes user input value
    var userIngr = $("#ing-search").val().trim();
    // push userButton to array
    ingredients.push(userIngr);
    ingredientBasket.push(userIngr);
    // create object that will hold ingredient data for firebase
    var newIngr = {
        ingredientSearch: userIngr,
    };
    var arrayIngr = {
        ingrSearch: userIngr,
    }
    
    database.ref("/recentIngr").set(newIngr);
    database.ref("/userIngrSearch").push(arrayIngr);
    console.log("fb object: " + newIngr);
    $("#ing-search").val("");
    
    // ajax call when press search  
    var ingrQuery = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + userIngr;
  
    // ajax call
    // this will populate the screen with ALL DRINKS user can make with chosen ingredient
    $.ajax({
        url: ingrQuery,
        method: "GET"
    }).then(function(res){
       console.log(res);
    // console.log(res.drinks[0].strDrink)

            for(var k = 0; k < res.drinks.length; k++){
            // drink button
            var genDrink = $("<button>");
            genDrink.text(res.drinks[k].strDrink)
            genDrink.addClass("user-drinkbtn");
            genDrink.attr("data-drinkbtn", res.drinks[k].strDrink)
            $(".genDrink").append(genDrink);
        }
    });
    renderIngredientBasket();
    console.log("User Ingredients: " + ingredients);
    console.log("User Ingredient Basket: " + basket);
});

// on click event for user generated drink button
// this will populate the screen with drink name, image, instructions, and ingredients 
$(document).on("click", ".user-drinkbtn", function(){
    
    console.log(this);
    var drinkName = $(this).attr("data-drinkbtn");
    // drinkName.addClass("nameplate");
    console.log("onclick: " + drinkName)
    var drinkQuery = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkName;
    // var drinkQuery = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007"

    $.ajax({
        url: drinkQuery,
        method: "GET"
    }).then(function(drinkRes){
        console.log(drinkRes.drinks[0]);

        // // new div
        // var nameDiv = $("<div>");
        // var imgDiv = $("<div>");
        // var instructDiv = $("<div>");
        // var ingredientDiv = $("<div>");
        // var portionsDiv = $("<div>");

        // drink instructions location
        var drinkInstruct = (drinkRes.drinks[0].strInstructions);
       
        // drink image location
        var drinkImg = (drinkRes.drinks[0].strDrinkThumb);
 
        // image tag for clicked drink
        var thisDrink = $("<img>");
        // IMAGE ICON STYLE/WIDTH/HEIGHT
        thisDrink.attr("style", "width: 200px")
        thisDrink.attr("src", drinkImg);
        thisDrink.addClass("drink");

        // append to their respective divs
        $(".imgDiv").html(thisDrink);
        $(".nameDiv").text("Name: " + drinkName);
        $(".instructDiv").html(drinkInstruct);
        // instructDiv.append(drinkInstruct);
        

        if (drinkRes.drinks[0].strIngredient1 !== "" && drinkRes.drinks[0].strIngredient1 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient1)
            if(drinkRes.drinks[0].strMeasure1 !== "" && drinkRes.drinks[0].strMeasure1 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure1);
            }   
        }
        if (drinkRes.drinks[0].strIngredient2 !== "" && drinkRes.drinks[0].strIngredient2 !==null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient2)
            if(drinkRes.drinks[0].strMeasure2 !== "" && drinkRes.drinks[0].strMeasure2 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure2);
            }  
        }
        if (drinkRes.drinks[0].strIngredient3 !== "" && drinkRes.drinks[0].strIngredient3 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient3)
            if(drinkRes.drinks[0].strMeasure3 !== "" && drinkRes.drinks[0].strMeasure3 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure3);
            }  
        }
        if (drinkRes.drinks[0].strIngredient4 !== "" && drinkRes.drinks[0].strIngredient4 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient4)
            if(drinkRes.drinks[0].strMeasure4 !== "" && drinkRes.drinks[0].strMeasure4 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure4);
            }
        }
        if (drinkRes.drinks[0].strIngredient5 !== "" && drinkRes.drinks[0].strIngredient5 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient5)
            if(drinkRes.drinks[0].strMeasure5 !== "" && drinkRes.drinks[0].strMeasure5 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure5);
            } ;
        }
        if (drinkRes.drinks[0].strIngredient6 !== "" && drinkRes.drinks[0].strIngredient6 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient6)
            if(drinkRes.drinks[0].strMeasure6 !== "" && drinkRes.drinks[0].strMeasure6 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure6);
            }   
        }
        if (drinkRes.drinks[0].strIngredient7 !== "" && drinkRes.drinks[0].strIngredient7 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient7)
            if(drinkRes.drinks[0].strMeasure7 !== "" && drinkRes.drinks[0].strMeasure7 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure7);
            }   
        }
        if (drinkRes.drinks[0].strIngredient8 !== "" && drinkRes.drinks[0].strIngredient8 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient8)
            if(drinkRes.drinks[0].strMeasure8 !== "" && drinkRes.drinks[0].strMeasure8 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure8);
            }   
        }
        if (drinkRes.drinks[0].strIngredient9 !== "" && drinkRes.drinks[0].strIngredient9 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient9)
            if(drinkRes.drinks[0].strMeasure9 !== "" && drinkRes.drinks[0].strMeasure9 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure9);
            }   
        }
        if (drinkRes.drinks[0].strIngredient10 !== "" && drinkRes.drinks[0].strIngredient10 !== null) {
            $(".ingredientsDiv").html(drinkRes.drinks[0].strIngredient10)
            if(drinkRes.drinks[0].strMeasure10 !== "" && drinkRes.drinks[0].strMeasure10 !== " "){
                $(".portionsDiv").html(drinkRes.drinks[0].strMeasure10);
            }   
        }
        
        var drinkDiv = $("<div>");
        drinkDiv.append(nameDiv, imgDiv, instructDiv, ingredientDiv, portionsDiv);
       
        $("#result-div").empty();
        $("#result-div").append(drinkDiv);
    })
})

/////
///firebase listeners
////
database.ref("/recentDrink").on("child_added", function(drinkSnap){
    console.log("firebase drink: " + drinkSnap.val());
})

database.ref("/recentIngr").on("child_added", function(ingrSnap){
    console.log("firebase ingr: " + ingrSnap.val());
})