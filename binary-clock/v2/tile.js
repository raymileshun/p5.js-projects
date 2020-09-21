function Tile(posX,posY,size,color){
  this.x=posX
  this.y=posY
  this.size=size
  this.color=color

  this.selected=false

  let defaultColor=[0,100,100]

  this.show=function(){
    if(!this.selected){
      fill(defaultColor)
    } else {
      fill(this.color)
    }
    // stroke(0)
    // strokeWeight(2)
    rect(this.x,this.y,this.size,this.size/3)
  }

}
