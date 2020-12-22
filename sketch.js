var p1,p2;
var pos1,pos2;
var database;
var p1image, p2image;
var gameState;
var p1score,p2score;


/*function preload(){
    p1image = loadAnimation("assets/player1a.png","assets/player1b.png","assets/player1a.png");
    p2image = loadAnimation("assets/player2a.png","assets/player2b.png","assets/player2a.png");
}*/

function setup(){
    database = firebase.database();

    createCanvas(600,600);

    p1 = createSprite(150,250,50,50);
    p1.shapeColor = "red";
    //p1.addAnimation("walking",p1Image);
    //p1.frameDelay = 200;
    p1.scale = 0.5;
    p1.setCollider("circle",0,0,50);
    p1.debug = true;

    var p1pos = database.ref('player1/position');
    p1pos.on("value",readPosition,showError);

    p2 = createSprite(450,280,50,50);
    p2.shapeColor = "yellow";
    //p2.addAnimation("walking",p2Image);
    //p2.frameDelay = 200;
    p2.scale = 0.5;
    p2.setCollider("circle",0,0,50);
    p2.debug = true;

    var p2pos = database.ref('player2/position');
    p2pos.on("value",readPosition2,showError);

    gameState = database.ref('gameState/');
    gameState.on("value",readGS,showError);

    p1score = database.ref('player1score/');
    p1score.on("value",readScore1,showError);

    p2score = database.ref('player2score/');
    p2score.on("value",readScore2,showError);

}

function draw(){
    background("white");

    if(gameState === 0){
        fill("black");
        text("Press Space to serve",300,80);

        if(keyDown("space")){
            rand = Math.round(random(1,2));
            if(rand === 1){
                database.ref('/').update({
                    'gameState' : 1
                })
                alert("RED PLAYS");
            }
            if(rand === 2){
                database.ref('/').update({
                    'gameState' : 2
                })
                alert("YELLOW PLAYS");
            }
            database.ref('player1/position').update({
                'x' : 150,
                'y' : 300
            })
        }
    }

    if(gameState === 1){

        if(keyDown(LEFT_ARROW)){
            writePosition(-2,0);
        }
        else if(keyDown(RIGHT_ARROW)){
            writePosition(2,0);
        }
        else if(keyDown(UP_ARROW)){
            writePosition(0,-2);
        }
        else if(keyDown(DOWN_ARROW)){
            writePosition(0,2);
        }
        else if(keyDown("w")){
            writePosition2(0,-2);
        }
        else if(keyDown("s")){
            writePosition2(0,2);
        }


        if(p1.x > 500){
            database.ref('/').update({
                'player1score' : p1score - 5,
                'player2score' : p2score + 5,
                'gameState' : 0
            })
            alert("RED WINS");
        }
        
        if(p1.isTouching(p2)){
            database.ref('/').update({
                'gameState' :0,
                'player1score': p1score + 5,
                'player2score': p2score - 5
            })
            alert("RED LOSES");
        }
    }

    if(gameState === 2){
        if(keyDown("a")){
            writePosition2(-2,0);
        }
        else if(keyDown("s")){
            writePosition2(2,0);
        }
        else if(keyDown("w")){
            writePosition2(0,-2);
        }
        else if(keyDown("z")){
            writePosition2(0,2);
        }
        else if(keyDown(UP_ARROW)){
            writePosition(0,-2);
        }
        else if(keyDown(DOWN_ARROW)){
            writePosition(0,2);
        }


        if(p2.x < 100){
            database.ref('/').update({
                'player1score' : p1score + 5,
                'player2score' : p2score - 5,
                'gameState' : 0
            })
            alert("YELLOW WINS");
        }
        
        if(p1.isTouching(p2)){
            database.ref('/').update({
                'gameState' : 0,
                'player1score': p1score - 5,
                'player2score': p2score + 5
            })
            alert("YELLOW LOSES");
        }
    }

    textSize(10);
    text("RED"+ p1score,350,15);
    text("YELLOW"+ p2score,250,15);

    for(var i = 0; i<600; i=i+40){
        stroke("yellow")
        line(150,i,150,i+20);
    }

    for(var i1 = 0; i1<600; i1=i1+40){
        stroke("black")
        line(300,i1,300,i1+20);
    }

    for(var i2 = 0; i2<600; i2=i2+40){
        stroke("red")
        line(450,i2,450,i2+20);
    }

  drawSprites();
}

function writePosition(x,y){
    database.ref('player1/position').set({
        'x' : pos1.x + x,
        'y' : pos1.y + y
    })
}

function writePosition2(x,y){
    database.ref('player2/position').set({
        'x' : pos2.x + x,
        'y' : pos2.y + y
    })
}


function readPosition(data){
    pos1 = data.val();
    p1.x = pos1.x;
    p1.y = pos1.y;
}

function readPosition2(data){
    pos2 = data.val();
    p2.x = pos2.x;
    p2.y = pos2.y;
}

function readGS(data){
    gameState = data.val();
}

function readScore1(data1){
    p1score = data1.val();
}

function readScore2(data2){
    p2score = data2.val();
}

function showError(){
    console.log("Write error")
}

