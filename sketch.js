var dog, happyDog;
var database;
var foodS, foodStock;
var Dog;
var foodObj;
var lastFed;

function preload(){
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  console.log(database);

  var canvas = createCanvas(500,500);
  
  Dog = createSprite(250,300,10,10);
  Dog.addImage("dog",dog);
  Dog.scale = 0.2;

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("add the food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46, 139, 87);

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  if(lastFed >= 12){
    stroke("red");
    fill("cyan");
    textSize(15);
    text("Last Feed: " + lastFed % 12 + "PM",350,30);
  }
  else if(lastFed === 0){
    stroke("red");
    fill("cyan");
    textSize(15);
    text("Last Feed: 12 AM",350,30);
  }
  else {
    stroke("red");
    fill("cyan");
    textSize(15);
    text("Last Feed: " + lastFed + "AM",350,30);
  }

  foodObj.display();

  drawSprites();
  
  stroke("pink");
  fill("cyan");
  text("Food Remaining: " + foodS, 130,200);

  

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  Dog.addImage("happy",happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() -1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  });
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food:foodS
  });
} 



