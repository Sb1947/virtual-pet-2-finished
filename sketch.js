//Create variables here
var Dog,happyDog;
var DogImg1,DogImg2;
var database;
var feedPet, addFoodStock;
var foodObj;
var foodS,foodStock;
var readState,gameState;
var fedTime,lastFed;

function preload()
{
	//load images here
 DogImg1 =  loadImage("Dog.png")
 DogImg2 =  loadImage("happydog.png")
}

function setup() 
{
  database = firebase.database()
  createCanvas(1000, 400);
  foodObj = new Food();
  foodStock = database.ref('Food')
  foodStock.on("value",readStock)
  Dog = createSprite(250,250,15,15);
  Dog.addImage("normal dog",DogImg1)
  Dog.scale = 0.2


  feed = createButton("Feed The Dog");
  feed.position(685,100);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(795,100);
  addFood.mousePressed(addFoods);
}


function draw() {  

background(46,139,87);  
foodObj.display();
fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
fill("white");
textSize(20);
text("Food Remaining: " + foodS, 300,100)


  /*readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });*/
if(lastFed>=12)
      {
      text("Last Feed : "+ lastFed%12 + " PM", 350,30);
      }
      else if(lastFed==0)
      {
           text("Last Feed : 12 AM",350,30);
      }
      else
      {
          text("Last Feed : "+ lastFed + " AM", 350,30);
      }
      drawSprites();
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
/*function writeStock(x){
if(x < 0)
{
  x = 0
} else{
  x = x-1
}
database.ref('/').update({
  Food : x
})
}*/
function feedDog()
{
    
    Dog.addImage(DogImg2);
    if(foodObj.getFoodStock()<=0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0)
    } else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    }
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
}
function addFoods()
{
  foodS++;
  database.ref('/').update({
  Food:foodS
  })
}


