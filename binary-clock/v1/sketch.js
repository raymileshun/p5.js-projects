
let hourTiles=[]
let minuteTiles=[]
let secondTiles=[]
let millsTiles=[]

let allTiles=[]


//maximum hány bit kell, hogy a különböző számokat megjelenítsük
let maximumBinaryPlacesForHours=5,maximumBinaryPlacesForMinutes=6,
maximumBinaryPlacesForSeconds=6,maximumBinaryPlacesForMills=4

function setup() {
  createCanvas(800, 800);


  //itt ezek nem a megfelelőek, szóval néhány képernyőméretnél szét fognak csúszni, csak nem volt kedvem
  //tovább foglalkozni vele
  let startPosition=width/3.5
  let tileSize=width/10
  let spacing=1.1*tileSize

  let heightStart=height/3
  let verticalSpace=0.5*tileSize

  let hourColors=[255,250,0]
  let minuteColors=[255,0,0]
  let secondColors=[0,255,0]
  let millsColors=[0,0,255]

  for(let i=0;i<maximumBinaryPlacesForHours;i++){
    hourTiles.push(new Tile(startPosition,heightStart+i*verticalSpace,tileSize,hourColors))
  }

  for(let i=0;i<maximumBinaryPlacesForMinutes;i++){
    minuteTiles.push(new Tile(startPosition+spacing,heightStart+i*verticalSpace,tileSize,minuteColors))
  }

  for(let i=0;i<maximumBinaryPlacesForSeconds;i++){
    secondTiles.push(new Tile(startPosition+2*spacing,heightStart+i*verticalSpace,tileSize,secondColors))
  }

  for(let i=0;i<maximumBinaryPlacesForMills;i++){
    millsTiles.push(new Tile(startPosition+3*spacing,heightStart+i*verticalSpace,tileSize,millsColors))
  }

  allTiles.push(hourTiles)
  allTiles.push(minuteTiles)
  allTiles.push(secondTiles)
  allTiles.push(millsTiles)
}

function draw() {
  frameRate(10)
  background(50);
  let date = new Date();
  let hours= date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  let mills = Math.floor(date.getMilliseconds()/100)

  let hoursInBinary=convertNumberToBinary(hours,maximumBinaryPlacesForHours)
  let minutesInBinary=convertNumberToBinary(minutes,maximumBinaryPlacesForMinutes)
  let secondsInBinary=convertNumberToBinary(seconds,maximumBinaryPlacesForSeconds)
  let millsInBinary=convertNumberToBinary(mills,maximumBinaryPlacesForMills)

  for(let i=0;i<hourTiles.length;i++){
    if(hoursInBinary[i]===1){
      hourTiles[i].selected=true
    }
  }

  for(let i=0;i<minuteTiles.length;i++){
    if(minutesInBinary[i]===1){
      minuteTiles[i].selected=true
    }
  }

  for(let i=0;i<secondTiles.length;i++){
    if(secondsInBinary[i]===1){
      secondTiles[i].selected=true
    }
  }

  for(let i=0;i<millsTiles.length;i++){
    if(millsInBinary[i]===1){
      millsTiles[i].selected=true
    }
  }
  push()
  fill(70)
  rect(width/4,height/4,5*width/10,height/2.5)
  pop()

  for(tileType of allTiles){
    for(tile of tileType){
      tile.show()
      //ezt lehet külön functionbe kellene rakni, mert így nullázzuk ki a tileok értékét
      //mert egyébként benn ragadna a "selected" érték
      tile.selected=false
    }
  }

  push()
  noStroke();
  textSize(width/27)
  fill(255,0,0)
  hours=formatNumber(hours)
  minutes=formatNumber(minutes)
  seconds=formatNumber(seconds)
  let time = hours+":"+minutes+":"+seconds+"."+mills
  text(time,width/2.3,height/3.2)
  pop()

}


function convertNumberToBinary(number,decimalPlaces){
  let done=false;
  let remainders=[];
  let temp=number;

  while(!done){
    let quotient=Math.floor(temp/2)
    remainders.push(temp-(quotient*2))

    temp=quotient;
    if(temp===0){
      done=true;
    }
  }
  let neededZeroes=decimalPlaces-remainders.length

  for(let i=0;i<neededZeroes;i++){
    remainders.push(0)
  }
  remainders.reverse()
  return remainders;
}

function formatNumber(number){
  let numberString=number.toString()
  let numbers=numberString.split('')
  if(numbers.length===1){
    numbers.push(0)
    numbers.reverse()
  }
  let time="";
  for(num of numbers){
    time+=num
  }
  return time
}
