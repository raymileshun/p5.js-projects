let pointsArray=[];
const pointsNumber=20;
const k= 3;


function setup() {
  createCanvas(800, 800);
  rectMode(CENTER)
  for(let i=0;i<pointsNumber;i++){
    pointsArray.push(new Point());
  }
  let x = document.createElement("TABLE")
  x.setAttribute("id", "ratioTable")
  document.body.appendChild(x)
  document.getElementById("ratioTable").insertRow().insertCell(0);
}

function draw() {
  let arrayOfPointsUsedForRatioCalculation=[];
  background(0);
  drawCoordinateLines();
  drawClassIds();
  
  let distances=getDistancesForPoints()
  let closestPointsArray=getKClosestIndexes(distances);
  
  // let closestPointsArray=getKClosestIndexes();
  for(let i=0;i<pointsArray.length;i++){
    if(closestPointsArray.includes(i)){
        strokeWeight(5)
        stroke('blue')
        line(mouseX,mouseY,pointsArray[i].x,pointsArray[i].y)
        arrayOfPointsUsedForRatioCalculation.push(pointsArray[i]);
    }
    pointsArray[i].show();

    noStroke()
    fill(255,0,0)
    // text(parseInt(calculatePointDistanceFromMouse(pointsArray[i])),pointsArray[i].x,pointsArray[i].y)
	text(parseInt(Math.sqrt(distances[i][1])),pointsArray[i].x,pointsArray[i].y)
  }
  getPointsRatio(arrayOfPointsUsedForRatioCalculation)

}

function drawCoordinateLines(){
  strokeWeight(2)
  stroke('white')
  line(width/2,height,width/2,0);
  strokeWeight(2)
  stroke('white')
  line(0,height/2,width,height/2);
}

function drawClassIds(){
  let offset=20;
  noStroke();
  fill(255)
  text(0,offset,offset)
  text(1,width/2+offset,offset)
  text(2,width/2+offset,height/2+offset)
  text(3,offset,height/2+offset)
}



function getPointsRatio(array){
  let occurences=[]
  for(let i=0;i<array.length;i++){
    let id=array[i].classId;
    // console.log(occurences)
    if(occurences.length===0 || !arrayHasMultipleElements(occurences,id)){
      let obj={
        "id":id,
        "occurences": getOccurencesInArray(array,array[i].classId)
      }
      occurences.push(obj);
    }
  }
  occurences.sort(function(a,b){
    return a[1]-b[1]
  });
  let arrayLength=occurences.length
  let allOccurences=getOccurencesInArray(occurences);

  let textToWrite=""
  for(let i=0;i<arrayLength;i++){
    textToWrite+=" id: "+occurences[i].id+" occurence: "+occurences[i].occurences+" dominance: "+occurences[i].occurences/k+"\n<br>"
  }
  document.getElementById("ratioTable").rows[0].cells[0].innerHTML=textToWrite;
  noStroke()
  fill(0,255,0)
  // text(textToWrite,width/2,height/2)
  // console.log(occurences)

}



function arrayHasMultipleElements(array,searchableElement){
  let ids=[];
  for(let i=0;i<array.length;i++){
    ids.push(array[i].id)
  }
  return ids.includes(searchableElement)

}

function getOccurencesInArray(array,searchableElement){
  let occurence=0;
    for(let i=0;i<array.length;i++){
      if(array[i].classId===searchableElement){
        occurence++;
      }
    }
    return occurence;
}


function getDistancesForPoints(){
  let distanceArray=[];
  for(let i=0;i<pointsArray.length;i++){
    distanceArray.push([i,calculatePointDistanceFromMouse(pointsArray[i])])
  }
  return distanceArray;
}

function getKClosestIndexes(distanceArray){
  let closestArray=[];
  let distanceCopy=distanceArray.slice()
  
  for(let i=0;i<k;i++){
	 let index=getMinimalElementIndexFrom2DArray(distanceCopy)
	 // let spliceableIndex;
	 for(let j=0;j<distanceCopy.length;j++){
		if(distanceCopy[j][0]===index){
			// spliceableIndex=j;
			distanceCopy.splice(j,1)
			break;
		}
	 }
	 // distanceCopy.splice(spliceableIndex,1)
	 closestArray.push(index)
  }
  return closestArray;
}

function getMinimalElementIndexFrom2DArray(array){
	let minimalIndex=array[0][0];
	let minimalElement=array[0][1]
	if(array.length===1){
		return minimalIndex
	}
	for(let i=1;i<array.length;i++){
		if(array[i][1]<minimalElement){
			minimalElement=array[i][1]
			minimalIndex=array[i][0]
		}
	}
	return minimalIndex
}



// function getKClosestIndexes(){
  // let distanceArray=[];
  // let closestArray=[];
  // for(let i=0;i<pointsArray.length;i++){
    // distanceArray.push([i,calculatePointDistanceFromMouse(pointsArray[i])])
  // }

  // distanceArray.sort(function(a,b){
    // return a[1]-b[1]
  // });


  // for(let i=0;i<k;i++){
    // closestArray[i]=distanceArray[i][0];
  // }
  // return closestArray;

// }



function calculatePointDistanceFromMouse(pnt){
  // return dist(mouseX,mouseY,pnt.x,pnt.y)
  return distanceSquared(mouseX,mouseY,pnt.x,pnt.y)
}

function distanceSquared(msX,msY,pointX,pointY){
	return (msX-pointX)*(msX-pointX)+(msY-pointY)*(msY-pointY)
}
