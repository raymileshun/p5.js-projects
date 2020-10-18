function Shape(vertices){

  //vagy reflexPoints
  this.vertices=vertices
  this.concavePoints=[];

  this.innerTriangles=[];

  this.centroid=calculateCentroid(vertices)
  // this.vertices=sortVerticesByClockwiseOrder(vertices,this.centroid)


  let shapeSpeed=3;
  let errorHappened=false
  let isPolygonConvex=false
  let remVertices=[]
  let drawableTriangles=[]

  let currentStep;
  let done=false

  this.increaseCurrentStep=function(){
    if(this.innerTriangles.length>0&&currentStep<this.innerTriangles.length-1){
      currentStep++
      let vertex=this.innerTriangles[currentStep][1].copy()
      vertex.y+=height/2
      let index=getIndexForVertex(vertex,remVertices)
      // console.log(index)
      if(index!==-1){
        remVertices.splice(index,1)
      }
      drawableTriangles.push(this.innerTriangles[currentStep])
    } else if(currentStep===this.innerTriangles.length-1) {
      done=true;
    }


  }

  this.loadModel=function(){
    // this.concavePoints=this.determineConcavePoints()
    this.concavePoints=determineReflexPoints(this.vertices);

    if(this.concavePoints.length!==0){
      this.innerTriangles=this.triangulatePolygon()
    }

  }

  this.show= function(){
      if(errorHappened){
        fill(255)
        text("Hibás poligon!",100,100)
      } else
      if(isPolygonConvex){
        fill(255)
        text("A síkidom konvex!",200,100)
      } else if(done){
        push()
        fill(200,100,0)
        textSize(23)
        text("Kész",30,100)
        pop()
      }


      push()
      rectMode(CENTER)
      fill(237, 34, 93);
      // rotate(this.angle)
      noStroke();
      beginShape();
      for(let i=0;i<this.vertices.length;i++){
        vertex(this.vertices[i].x,this.vertices[i].y);
        push()
        stroke('purple')
        strokeWeight(10)
        point(this.vertices[i].x,this.vertices[i].y)
        pop()
      }
      endShape();

      push()
      stroke(0,255,0)
      strokeWeight(2)
      for(let triangle of drawableTriangles){
        line(triangle[0].x,triangle[0].y,triangle[2].x,triangle[2].y)

        fill(205,20,0,200)
        beginShape();
          vertex(triangle[0].x,triangle[0].y);
          vertex(triangle[1].x,triangle[1].y);
          vertex(triangle[2].x,triangle[2].y);
        endShape();
      }
      pop()

      textSize(40)
      for(let i=0;i<this.vertices.length;i++){
        push()
        fill(255)
        text(i,this.vertices[i].x-10,this.vertices[i].y)
        pop()
      }

      if(currentStep>=0){
        push()
        stroke('blue')
        strokeWeight(20)
        point(this.innerTriangles[currentStep][1].x,this.innerTriangles[currentStep][1].y)
        pop()
      }


      for(let pnt of this.concavePoints){
        stroke(200)
        strokeWeight(20)
        point(pnt.x,pnt.y)
      }
      // point(this.centroid.x,this.centroid.y)
      pop()


      let textToWrite="Létrehozott háromszögek: <br>"
      for(let triangle of drawableTriangles){
        textToWrite+="["
        for(let vertex of triangle){
          textToWrite+="( x: "+vertex.x+" y: "+vertex.y+ " ) "
        }
        textToWrite+="]<br>"

      }
      textToWrite+="<br>Háromszög tömb mérete: "+drawableTriangles.length
      document.getElementById("triangleSection").rows[0].cells[0].innerHTML=textToWrite;

      // push()
      // textSize(24)
      // stroke(255)
      // text(this.innerTriangles[0][0],100,100)
      // pop()


  }

  this.initSecondaryVertices=function(){
    if(this.innerTriangles.length>0 && !errorHappened){
      remVertices=[]
      currentStep=0;
      for(let vertex of this.vertices){
        remVertices.push(vertex.copy())
      }
      for(let vertex of remVertices){
        vertex.y=vertex.y+height/2
      }

      remVertices.splice(0,1)
      drawableTriangles.push(this.innerTriangles[currentStep])
    } else {
      isPolygonConvex=true;
    }
  }

  this.showSecondaryPolygon=function(){
    push()
    rectMode(CENTER)
    fill(237, 34, 93);
    // rotate(this.angle)
    noStroke();
    beginShape();
    for(let i=0;i<remVertices.length;i++){
      vertex(remVertices[i].x,remVertices[i].y);
    }
    endShape();
    pop()

    push()
    for(let i=0;i<remVertices.length;i++){
      // stroke('yellow')
      strokeWeight(12)
      // point(remVertices[i].x,remVertices[i].y);
    }

    pop()
  }


  //Ez majd később kell, hogy ha fel akarom osztani a konkáv síkidomot több konvex síkidomra
  this.determineConcavePoints=function(){
    //előjelekhez egy tömb. ha mindegyik negatív, vagy pozitív, akkor konvex
    let signs=[]
    let concavePoints=[]
    if(this.vertices.length<4){
      return concavePoints
    }
    for(let i=0;i<this.vertices.length;i++){
      let nextIndex1;
      let nextIndex2;
      if(i===this.vertices.length-2){
        nextIndex1 = this.vertices.length-1
        nextIndex2=0
      } else if(i===this.vertices.length-1){
        nextIndex1=0
        nextIndex2=1
      } else{
        nextIndex1=i+1
        nextIndex2=i+2
      }

      let dx1 = this.vertices[nextIndex1].x-this.vertices[i].x
      let dy1 = this.vertices[nextIndex1].y-this.vertices[i].y
      let dx2 = this.vertices[nextIndex2].x-this.vertices[nextIndex1].x
      let dy2 = this.vertices[nextIndex2].y-this.vertices[nextIndex1].y
      let zCrossProduct = dx1*dy2 - dy1*dx2
      signs.push(zCrossProduct)
    }


    for(let i=0;i<signs.length;i++){
      if(signs[i]<=0){
        if(i===signs.length){
          concavePoints.push(this.vertices[0])
        } else {
          concavePoints.push(this.vertices[i+1])
        }
      }
    }
    return concavePoints
  }


  this.triangulatePolygon=function(){
    let remainingVertices=this.vertices.slice()
    let createdTriangles=[]
    let currentIndex=0;
    let quit=false;
    let spliceHappened=false

    let limit=this.vertices.length*10
    let errorListener=0
    let reflexPoints=this.concavePoints.slice()

    while(!quit){
      if(errorListener===limit){
        quit=true;
        errorHappened=true
      }
      errorListener++

      if(remainingVertices.length===3){
        let triangle=[]
        triangle.push(remainingVertices[0],remainingVertices[1],remainingVertices[2])
        createdTriangles.push(triangle)
        quit=true
      } else if(allRemainingVerticesReflexes(remainingVertices,this.concavePoints)){
        reflexPoints=determineReflexPoints(remainingVertices)
      }

      if(!reflexPoints.includes(remainingVertices[currentIndex])){

          let previousIndex;
          let nextIndex;
          let lastIteration=false;

          if(currentIndex===0){
            previousIndex=remainingVertices.length-1
            nextIndex=1
          } else if(currentIndex===remainingVertices.length-1){
            previousIndex=remainingVertices.length-2
            nextIndex=0
          } else{
            nextIndex=currentIndex+1
            previousIndex=currentIndex-1
          }

          let triangle=[]
          triangle.push(remainingVertices[previousIndex],remainingVertices[currentIndex],remainingVertices[nextIndex])

          if(isTriangleValid(triangle,remainingVertices)){
            createdTriangles.push(triangle)
            remainingVertices.splice(currentIndex,1)
            spliceHappened=true

          } else{
            currentIndex++
          }


      } else if(currentIndex<remainingVertices.length-1){
        currentIndex++
      }
      if(currentIndex===remainingVertices.length) {
        currentIndex=0
      }

    }

    return createdTriangles

  }


}

function sortVerticesByClockwiseOrder(vertices,centerPoint){
  let verticesCopy=vertices.slice()

  //megadja, hogy az eredeti listában levő hanyas indexű elem melyik index helyen fog elhelyezkedni
  let positions=new Map()
  for(let i=0;i<verticesCopy.length;i++){
    let numberOfVerticesThatAreHigher=0;
    for(let j=0;j<verticesCopy.length;j++){

      if(i!==j){
        if(isPointLess(verticesCopy[i],verticesCopy[j],centerPoint)){
          numberOfVerticesThatAreHigher++
        }
      }

    }
    positions.set(i,verticesCopy.length-numberOfVerticesThatAreHigher-1)
  }

  let sortedVertices=[]
  let index = 0;

  for (let vertexPos of positions) {
      let key=vertexPos[0]
      let value=vertexPos[1]
      sortedVertices[value]=verticesCopy[key]
  }

  // positions.forEach( (value, key, map) => {
  //   if(value===index){
  //     sortedVertices.push(verticesCopy[index])
  //   }
  //
  //   index++
  // });

  return sortedVertices.reverse()

}

function getIndexForVertex(vertex,array){
  for(let i=0;i<array.length;i++){
    if(areVerticesIdentical(vertex,array[i])){
      return i;
    }
  }
  return -1
}

function isPointLess(pointA, pointB,center) {

    if (pointA.x - center.x >= 0 && pointB.x - center.x < 0)
        return true;
    if (pointA.x - center.x < 0 && pointB.x - center.x >= 0)
        return false;
    if (pointA.x - center.x == 0 && pointB.x - center.x == 0) {
        if (pointA.y - center.y >= 0 || pointB.y - center.y >= 0)
            return pointA.y > pointB.y;
        return pointB.y > pointA.y;
    }

    let det = (pointA.x - center.x) * (pointB.y - center.y) - (pointB.x - center.x) * (pointA.y - center.y);
    if (det < 0)
        return true;
    if (det > 0)
        return false;


    let d1 = (pointA.x - center.x) * (pointA.x - center.x) + (pointA.y - center.y) * (pointA.y - center.y);
    let d2 = (pointB.x - center.x) * (pointB.x - center.x) + (pointB.y - center.y) * (pointB.y - center.y);
    return d1 > d2;
}


function calculateCentroid(vertices){
  let centroid = createVector()
  for(let vertex of vertices){
    centroid.x+=vertex.x
    centroid.y+=vertex.y
  }
  centroid.x=centroid.x/vertices.length
  centroid.y=centroid.y/vertices.length

  return centroid;

}

function determineReflexPoints(vertices) {
  let signs=[]
  let reflexPoints=[]
  if(vertices.length<4){
    return reflexPoints
  }
  for(let i=0;i<vertices.length;i++){
    let nextIndex1;
    let nextIndex2;
    if(i===vertices.length-2){
      nextIndex1 = vertices.length-1
      nextIndex2=0
    } else if(i===vertices.length-1){
      nextIndex1=0
      nextIndex2=1
    } else{
      nextIndex1=i+1
      nextIndex2=i+2
    }

    let dx1 = vertices[nextIndex1].x-vertices[i].x
    let dy1 = vertices[nextIndex1].y-vertices[i].y
    let dx2 = vertices[nextIndex2].x-vertices[nextIndex1].x
    let dy2 = vertices[nextIndex2].y-vertices[nextIndex1].y
    let zCrossProduct = dx1*dy2 - dy1*dx2
    signs.push(zCrossProduct)
  }


  for(let i=0;i<signs.length;i++){
    if(signs[i]<=0){
      if(i===signs.length-1){
        reflexPoints.push(vertices[0])
      } else {
        reflexPoints.push(vertices[i+1])
      }
    }
  }
  return reflexPoints
}


function allRemainingVerticesReflexes(remainingVertices,reflexPoints){
  for(let i=0;i<remainingVertices.length;i++){
    if(!reflexPoints.includes(remainingVertices[i])){
      return false
    }
  }
  return true;
}


function isTriangleValid(triangle,remainingVertices){
  let primaryTriangleArea=calculateArea(triangle[0],triangle[1],triangle[2])
  for(let i=0;i<remainingVertices.length;i++){
      let givenPoint=remainingVertices[i];
      if(!isCurrentPointInGivenTriangle(triangle,remainingVertices[i])){

        let triangleA=calculateArea(givenPoint,triangle[1],triangle[2])
        let triangleB=calculateArea(triangle[0],givenPoint,triangle[2])
        let triangleC=calculateArea(triangle[0],triangle[1],givenPoint)

        //a kiválasztott pont benne van a háromszögben, szóval a háromszögünk nem lesz jó
        if((triangleA+triangleB+triangleC)===primaryTriangleArea){
          return false
        }
      }
  }

  return true
}


function eliminateGivenTriangleFromVertices(triangle,remainingVertices){
  let vertices=remainingVertices.slice()
  let index=0;
  for(let i=0;i<vertices.length;i++){
    for(let j=0;j<triangle.length;j++){
      if(areVerticesIdentical(vertices[i],triangle[j])){
        vertices.splice(index,1)
      } else{
        index++
      }
    }

  }
  return vertices;
}


function calculateArea(pnt1,pnt2,pnt3){
  return Math.abs((pnt1.x*(pnt2.y - pnt3.y) + pnt2.x*(pnt3.y - pnt1.y) + pnt3.x*(pnt1.y-pnt2.y))/2)
}

function areVerticesIdentical(pnt1,pnt2){
  if(pnt1.x===pnt2.x&&pnt1.y===pnt2.y&&pnt1.z===pnt2.z) {
    return true
  }
  return false
}

function isCurrentPointInGivenTriangle(triangle,pnt){
  for(let i=0;i<triangle.length;i++){
    if(areVerticesIdentical(triangle[i],pnt)) {
        return true;
    }
  }
  return false;

}
