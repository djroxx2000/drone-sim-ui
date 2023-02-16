export const getPathCoordsFromPath = (path) => {
  let textPath = "";
  for (let coord of path) {
    textPath += coord.lat + ", " + coord.lng + "\n";
  }
  return textPath;
};

export const parsePathFromPathCoords = (coords) => {
  const path = [];
  const coordsList = coords.split("\n");
  for (const coord of coordsList) {
    const [lat, lng] = coord.split(",").map(parseFloat);
    path.push({ lat, lng });
  }
  return path;
};
