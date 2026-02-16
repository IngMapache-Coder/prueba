import { Node } from '../pathUtils.js';

export class GridFactory {
  createFromResources(resources) {
    const { map, obstacles, stopPoints, route } = resources;
    const rows = map.height;
    const cols = map.width;

    const grid = [];
    for (let x = 0; x < rows; x++) {
      grid[x] = [];
      for (let y = 0; y < cols; y++) {
        grid[x][y] = new Node(x, y);
      }
    }

    obstacles.forEach(ob => {
      if (ob.posX < rows && ob.posY < cols) {
        grid[ob.posX][ob.posY].isObstacle = true;
      }
    });

    stopPoints.forEach(sp => {
      if (sp.posX < rows && sp.posY < cols) {
        grid[sp.posX][sp.posY].isStopPoint = true;
      }
    });

    if (route.startX < rows && route.startY < cols) {
      grid[route.startX][route.startY].isStart = true;
    }

    if (route.endX < rows && route.endY < cols) {
      grid[route.endX][route.endY].isEnd = true;
    }

    return grid;
  }

  createEmpty(width, height) {
    const grid = [];
    for (let x = 0; x < height; x++) {
      grid[x] = [];
      for (let y = 0; y < width; y++) {
        grid[x][y] = new Node(x, y);
      }
    }
    return grid;
  }

  print(grid) {
    for (let x = 0; x < grid.length; x++) {
      let row = '';
      for (let y = 0; y < grid[0].length; y++) {
        if (grid[x][y].isObstacle) row += '█';
        else if (grid[x][y].isStart) row += 'S';
        else if (grid[x][y].isEnd) row += 'E';
        else if (grid[x][y].isStopPoint) row += '●';
        else row += '·';
      }
      console.log(row);
    }
  }
}