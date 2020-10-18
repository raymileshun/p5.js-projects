let shape
let vertices=[]

let startButton, resetButton, nextStepButton

let showSecondary=false, startButtonAlreadyPressed=false

function setup() {

  createCanvas(800, 800);
  startButton=createButton('Start')
  startButton.position(width+10, 19);
  startButton.mousePressed(startButtonPressed);

  resetButton=createButton('Újrainditás')
  resetButton.position(width+90, 19);
  resetButton.mousePressed(resetButtonPressed);

  nextStepButton=createButton('Következő lépés')
  nextStepButton.position(width+190, 19);
  nextStepButton.mousePressed(nextStepButtonPressed);

  let innerTrianglesSection = document.createElement("TABLE")
  innerTrianglesSection.setAttribute("id", "triangleSection")
  document.body.appendChild(innerTrianglesSection)
  document.getElementById("triangleSection").insertRow().insertCell(0);
}

function draw() {
  background(0);
  push()
  stroke(255)
  strokeWeight(1)
  line(0,height/2,width,height/2)
  pop()

  if(shape){
    shape.show()
  }

  if(showSecondary){
    shape.showSecondaryPolygon()
  }

}

function startButtonPressed(){
  if(shape && !startButtonAlreadyPressed) {
    shape.loadModel()
    shape.initSecondaryVertices()
    showSecondary=true
    startButtonAlreadyPressed=true;
  }
}

function resetButtonPressed(){
  shape=undefined;
  vertices=[]
  showSecondary=false
  startButtonAlreadyPressed=false
}

function nextStepButtonPressed(){
  if(shape){
    shape.increaseCurrentStep()
  }
}

function mousePressed(){
  if(mouseIsInUpperHalf()){
    vertices.push(createVector(mouseX,mouseY))
    shape=new Shape(vertices)
    // shape.loadModel()
  }
}

function mouseIsInUpperHalf(){
  return mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height/2
}
