let cells=[];

let columnCellNumbers=[],rowCellNumbers=[];

let puzzleSize=10
let cellsColumnStartPosition=100;
let cellsRowStartPosition=100;
let cellSize


let eventHappened=false
// let selectedColumn=0, selectedRow=0;
// let columnCount=0, rowCount=0;


function setup() {
  createCanvas(800, 800)
  cellSize=(width-2*cellsColumnStartPosition)/(puzzleSize)
  initializeColumnAndRowNumbers()
  for(let i=0;i<puzzleSize;i++){
    cells[i]=[]
    // columnCellNumbers.push(0)
    // rowCellNumbers.push(0)
    for(let j=0;j<puzzleSize;j++){
      cells[i][j]=new Cell(cellsColumnStartPosition+i*cellSize,cellsRowStartPosition+j*cellSize,cellSize)
    }
  }

  drawInformations()

}

function draw() {
  //igazából ez a rész nem kellene, mert a mousePressed metóduson belül is újra lehetne rajzolni a
  //mezóket, viszont az a kód egy üres draw() loop-al kicsivel olvashatatlanabb, így viszont vissza lehetne
  //követni a kód folyását.
  if(eventHappened){
    drawInformations()
    eventHappened=false;
  }

  // background(240)
  // for(let i=0;i<cells.length;i++){
  //   for(let j=0;j<cells[i].length;j++){
  //     cells[i][j].show()
  //   }
  // }


  // if(eventHappened){
  //   // columnCellNumbers[selectedColumn]= countCellsInColumn(selectedColumn)
  //   // rowCellNumbers[selectedRow]=countCellsInRow(selectedRow)
  //
  //   // columnCount = countCellsInColumn(selectedColumn)
  //   // rowCount=countCellsInRow(selectedRow)
  //   // console.log(selectedColumn+1,columnCount)
  //   // console.log(selectedRow+1,rowCount)
  //   eventHappened=false
  // }

  // displayColumnAndRowNumbers()
  // text(columnCount,cellsColumnStartPosition+selectedColumn*cellSize+cellSize/2,cellsRowStartPosition)
  // text(rowCount,cellsColumnStartPosition,cellsRowStartPosition+selectedRow*cellSize+cellSize/2)
}

function drawInformations(){
  drawCells()
  displayColumnAndRowNumbers()
}

function drawCells(){
  background(240)
  for(let i=0;i<cells.length;i++){
    for(let j=0;j<cells[i].length;j++){
      cells[i][j].show()
    }
  }
}

  // function countCellsInColumn(column){
  //   let count=0;
  //   for(let i=0;i<cells[0].length;i++){
  //     if(cells[column][i].checked){
  //       count++
  //     }
  //   }
  //   columnCellNumbers[column]= count;
  // }

  function countCellsInColumnAndRow(column,row){
    restoreColumnAndRowNumbers(column,row)
    // initializeColumnAndRowNumbers()
    let count=1;
    let givenCellRow=0;
    if(cells[column][0].checked){
      columnCellNumbers[column][0]=count
    }

    for(let i=1;i<cells[0].length;i++){
      if(cells[column][i].checked && cells[column][i-1].checked){
        count++
        columnCellNumbers[column][givenCellRow]= count;
      }
      if(cells[column][i].checked && !cells[column][i-1].checked){
        count=1
        if(columnCellNumbers[column][0]!==0){
          columnCellNumbers[column].push(1)
          givenCellRow++
          columnCellNumbers[column][givenCellRow]= count;
        } else {
          columnCellNumbers[column][givenCellRow]=count;
        }
      }
    }

    let rowCount=1;
    let givenCellColumn=0;
    if(cells[0][row].checked){
      rowCellNumbers[row][0]=rowCount
    }

    for(let i=1;i<cells.length;i++){
      if(cells[i][row].checked && cells[i-1][row].checked){
        rowCount++
        rowCellNumbers[row][givenCellColumn]= rowCount;
      }
      if(cells[i][row].checked && !cells[i-1][row].checked){
        rowCount=1
        if(rowCellNumbers[row][0]!==0){
          rowCellNumbers[row].push(1)
          givenCellColumn++
          rowCellNumbers[row][givenCellColumn]= rowCount;
        } else {
          rowCellNumbers[row][givenCellColumn]=rowCount;
        }
      }
    }


  }

  // function countCellsInRow(row){
  //   let count=0;
  //   for(let i=0;i<cells.length;i++){
  //     if(cells[i][row].checked){
  //       count++
  //     }
  //   }
  //   rowCellNumbers[row] = count;
  // }


  function mousePressed(){
    for(let i=0;i<cells.length;i++){
      for(let j=0;j<cells[i].length;j++){
        if(cells[i][j].mouseIsInCell()){
          cells[i][j].checked=!cells[i][j].checked

          countCellsInColumnAndRow(i,j)
          eventHappened=true;

          // console.log(i+1,j+1,cells[i][j].checked)

          // columnCellNumbers[i]= countCellsInColumn(i)
          // rowCellNumbers[j]=countCellsInRow(j)
          // eventHappened=true;
        }
      }
    }
    // drawInformations()
  }

  function initializeColumnAndRowNumbers(){
    columnCellNumbers=[]
    rowCellNumbers=[]
    for(let i=0;i<puzzleSize;i++){
      columnCellNumbers[i]=[]
      rowCellNumbers[i]=[]
      columnCellNumbers[i].push(0)
      rowCellNumbers[i].push(0)
    }
  }

  //Az éppen adott sorban és oszlopban kinullázza először a sorok és oszlopokban szereplő cellák számait
  // és eztuán majd újraszámolom őket, és így nem kell bajlódni hogyan törlök ki egy sort ha több dimenziós a cellák száma.
  function restoreColumnAndRowNumbers(column,row){
    columnCellNumbers[column]=[]
    columnCellNumbers[column].push(0)

    rowCellNumbers[row]=[]
    rowCellNumbers[row].push(0);
  }

//Azért van külön a két for ciklus mert később lehet hogy asszimetrikus nonogrammokat akarok, ekkor viszont a sorok és oszlopok száma el fog térni.
function displayColumnAndRowNumbers(){
  for(let i=0;i<columnCellNumbers.length;i++){
    for(let j=0;j<columnCellNumbers[i].length;j++){
      text(columnCellNumbers[i][j],cellsColumnStartPosition+i*cellSize+cellSize/2,cellsRowStartPosition+j*20-columnCellNumbers[i].length*20)
    }
  }
  for(let i=0;i<rowCellNumbers.length;i++){
    for(let j=0;j<rowCellNumbers[i].length;j++){
      text(rowCellNumbers[i][j],cellsColumnStartPosition+j*20-rowCellNumbers[i].length*20,cellsRowStartPosition+i*cellSize+cellSize/2)
    }
  }
}
