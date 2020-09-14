function Cell(x,y,size){
  this.x=x;
  this.y=y;
  this.size=size;

  cellColor=0;

  this.checked=false;

  this.show=function(){

    if(this.checked){
      cellColor=0;
    } else{
      cellColor=255
    }
    fill(cellColor)
    stroke(100)
    strokeWeight(2)
    rect(this.x,this.y,this.size,this.size)

  }

  this.mouseIsInCell=function(){
    return this.x<mouseX && this.x+size>mouseX && this.y<mouseY && this.y+size>mouseY
  }

}
