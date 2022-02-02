
var Dog,happyDog;
var DogImg1,DogImg2,DogImg3;
var RoomImg1,RoomImg2,RoomImg3,OutsideImg;
var database;
var feedPet, addFoodStock;
var foodObj;
var foodS,foodStock;
var readState,gameState;
var fedTime,lastFed;

function preload()
{

 DogImg1 =  loadImage("Images/Dog.png")
 DogImg2 =  loadImage("Images/happydog.png")
 DogImg3 =  loadImage("Images/Lazy.png")
 RoomImg1 = loadImage("Images/Bed Room.png")
 RoomImg2 = loadImage("Images/Living Room.png")
 RoomImg3 = loadImage("Images/Wash Room.png")
 OutsideImg = loadImage("Images/Garden.png")
}

function setup() 
{
  database = firebase.database()

  createCanvas(400, 500);

  foodObj = new Food();

  foodStock = database.ref('Food')
  foodStock.on("value",readStock)

  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data){
  lastFed = data.val()
  })

  readState = database.ref('gameState')
  readState.on("value",function(data){
  gameState = data.val()
  })

  Dog = createSprite(250,375,15,15);
  Dog.addImage("normal dog",DogImg1)
  Dog.scale = 0.2


  feed = createButton("Feed The Dog");
  feed.position(140,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(250,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  

      currentTime = hour()
      if(currentTime==(lastFed+1)){
        update("Playing")
        foodObj.Outside()

      } else if(currentTime==(lastFed+2)){
        update("Sleeping")
        foodObj.bedroom()
      } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
        update("Bathing")
        foodObj.bathroom()
      } else {
        update("Hungry")
        foodObj.display()
      }

      if(gameState!="Hungry")
      {
        feed.hide()
        addFood.hide()
        Dog.remove()
      } 
      else{
        feed.show()
        addFood.show()
        Dog.addImage(DogImg3)
      }
      drawSprites();
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
    
    Dog.addImage(DogImg2);
    //if(foodObj.getFoodStock()<=0){
      foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    /*} else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    }*/
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    })
}
function addFoods()
{
  foodS++;
  database.ref('/').update({
  Food:foodS
  })
}


