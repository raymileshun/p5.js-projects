
let hourTiles=[]
let minuteTiles=[]
let secondTiles=[]
let millsTiles=[]

let allTiles=[]

function setup() {
  createCanvas(800, 800);


  //itt ezek nem a megfelelőek, szóval néhány képernyőméretnél szét fognak csúszni, csak nem volt kedvem
  //tovább foglalkozni vele
  let startPosition=width/8
  let tileSize=width/10
  let spacing=1.1*tileSize

  let heightStart=height/3
  let verticalSpace=0.5*tileSize

  let hourColors=[255,250,0]
  let minuteColors=[255,0,0]
  let secondColors=[0,255,0]
  let millsColors=[0,0,255]

  let columnOffset=0;
  let verticalCounter=0;

  for(let i=0;i<8;i++){
    if(i===4){
      columnOffset=tileSize
      verticalCounter=0
    }
    hourTiles.push(new Tile(startPosition+columnOffset,heightStart+verticalCounter*verticalSpace,tileSize,hourColors))
    minuteTiles.push(new Tile(startPosition+2*tileSize+columnOffset,heightStart+verticalCounter*verticalSpace,tileSize,minuteColors))
    secondTiles.push(new Tile(startPosition+4*tileSize+columnOffset,heightStart+verticalCounter*verticalSpace,tileSize,secondColors))
    // millsTiles.push(new Tile(startPosition+6*tileSize+columnOffset,heightStart+verticalCounter*verticalSpace,tileSize,millsColors))
    verticalCounter++
  }

  for(let i=0;i<4;i++){
    millsTiles.push(new Tile(startPosition+6*tileSize,heightStart+i*verticalSpace,tileSize,millsColors))
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
  let hours= convertTimeToArrays(date.getHours())
  let minutes = convertTimeToArrays(date.getMinutes())
  let seconds = convertTimeToArrays(date.getSeconds())
  let mills = Math.floor(date.getMilliseconds()/100)

  let hoursInBinary=[]
  let minutesInBinary=[]
  let secondsInBinary=[]

  for(let i=0;i<2;i++){
    hoursInBinary.push(convertNumberToBinary(hours[i],4))
    minutesInBinary.push(convertNumberToBinary(minutes[i],4))
    secondsInBinary.push(convertNumberToBinary(seconds[i],4))
  }

  let millsInBinary=convertNumberToBinary(mills,4)

  for(let i=0;i<4;i++){
    if(hoursInBinary[0][i]===1){
      hourTiles[i].selected=true
    }
    if(minutesInBinary[0][i]===1){
      minuteTiles[i].selected=true
    }
    if(secondsInBinary[0][i]===1){
      secondTiles[i].selected=true
    }
  }

  for(let i=0;i<4;i++){
    if(hoursInBinary[1][i]===1){
      hourTiles[i+4].selected=true
    }
    if(minutesInBinary[1][i]===1){
      minuteTiles[i+4].selected=true
    }
    if(secondsInBinary[1][i]===1){
      secondTiles[i+4].selected=true
    }
  }



  for(let i=0;i<millsTiles.length;i++){
    if(millsInBinary[i]===1){
      millsTiles[i].selected=true
    }
  }
  // push()
  // fill(70)
  // rect(width/4,height/4,5*width/10,height/2.5)
  // pop()

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


function convertTimeToArrays(time){
  let numberString=time.toString()
  let numbers=numberString.split('')
  if(numbers.length===1){
    numbers.push(0)
    numbers.reverse()
  }
  let times=[]
  for(num of numbers){
    times.push(parseInt(num))
  }
  return times
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
  let time="";
  for(num of number){
    time+=num
  }
  return time
}
