class ReadingTracker {
  constructor(gridSize, priorStrength = 0.5, focusTime = 100) {
    this.gridSize = gridSize;
    this.priorStrength = priorStrength;
    this.focusTime = focusTime;
    this.grid = this.initializeGrid();
    this.lastFocusedCell = null;
    this.lastFocusTime = null;
  }

  initializeGrid() {
    return Array(this.gridSize.rows)
      .fill()
      .map(() =>
        Array(this.gridSize.cols)
          .fill()
          .map(() => ({ count: 0, lastSeen: 0 }))
      );
  }

  calcDiff(reactPoints) {
    console.log("react points");
    //for each PointerEvent, find difference between the calibration and react point
    //get the average of those differences to find the mapping number
    //use mapping number to map from gaze tracking coordinate to react point coordinate
    //find tile number based on react point coordinate
  }

  updateGaze(x, y, timestamp) {
    const row = Math.floor(y / (100 / this.gridSize.rows));
    const col = Math.floor(x / (100 / this.gridSize.cols));

    console.log(
      "row",
      row,
      " ",
      this.gridSize.rows,
      "col",
      col,
      " ",
      this.gridSize.cols
    );

    if (
      row >= 0 &&
      row < this.gridSize.rows &&
      col >= 0 &&
      col < this.gridSize.cols
    ) {
      this.grid[row][col].count++;
      this.grid[row][col].lastSeen = timestamp;

      if (this.lastFocusedCell) {
        const [lastRow, lastCol] = this.lastFocusedCell;
        if (
          timestamp - this.lastFocusTime >= this.focusTime ||
          row !== lastRow
        ) {
          this.highlightWord(lastRow, lastCol);
          this.lastFocusedCell = [row, col];
          this.lastFocusTime = timestamp;
        }
      } else {
        this.lastFocusedCell = [row, col];
        this.lastFocusTime = timestamp;
      }
    }
  }

  highlightWord(row, col) {
    let maxProbability = 0;
    let mostLikelyCell = [row, col];

    for (let i = 0; i < this.gridSize.rows; i++) {
      for (let j = 0; j < this.gridSize.cols; j++) {
        const count = this.grid[i][j].count;
        if (count === 0) continue;

        let prior = 1;
        if (i === row && j > col) {
          prior += this.priorStrength * (1 - (j - col) / this.gridSize.cols);
        } else if (i > row) {
          prior += this.priorStrength * 0.5;
        }

        const probability = count * prior;
        if (probability > maxProbability) {
          maxProbability = probability;
          mostLikelyCell = [i, j];
        }
      }
    }

    this.highlightCellInUI(mostLikelyCell[0], mostLikelyCell[1]);
    this.grid = this.initializeGrid();
  }

  highlightCellInUI(row, col) {
    console.log(`Highlight word at row ${row}, col ${col}`);
  }
}

module.exports = ReadingTracker;
