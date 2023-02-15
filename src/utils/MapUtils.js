import { log } from "./logUtils";
import {
  Component,
  Level,
  SPEED_MODIFIER,
  STATELESS_LOG_LEVEL,
} from "./constants";

export const center = {
  lat: 37.338207,
  lng: -121.88633,
};

export const demoCoordinates = {};

export const performStartupOperations = (map, document) => {
  const bounds = new window.google.maps.LatLngBounds(center);
  map.fitBounds(bounds);
  setTimeout(() => {
    // Logic required to bypass google maps not loading correctly for development account
    map.setZoom(15);
    const dismissBtnClassList =
      document.getElementsByClassName("dismissButton");
    if (dismissBtnClassList.length > 0) {
      dismissBtnClassList[0].click();
    }
  }, 1000);
};

export const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export const initialPath = [{ lat: 37.338207, lng: -121.88633 }];

const demoPath = `37.338207, -121.88633
37.332207, -121.88633
37.332207, -121.86033
37.338207, -121.87433
37.339207, -121.88233
37.338207, -121.88633
`;

export const polyLineOptions = {
  strokeColor: "#999999",
  strokeOpacity: 0.8,
  strokeWeight: 4,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  paths: [initialPath],
  zIndex: 1,
};

const getValidatedNextPoint = (
  distance,
  lastPoint,
  currentPoint,
  nextPoint,
  speed
) => {
  const scaledSpeed =
    (speed / distance) * Math.abs(nextPoint - lastPoint) * SPEED_MODIFIER;
  log(
    STATELESS_LOG_LEVEL,
    Component.MAP_CONTAINER,
    Level.DEBUG,
    "\nCurrent Point: ",
    currentPoint,
    "\nNext Point: ",
    nextPoint,
    "\nScaled Speed: ",
    scaledSpeed,
    "\nPoint Diff: ",
    Math.abs(currentPoint - nextPoint),
    "\nLast Point: ",
    lastPoint
  );
  if (Math.abs(nextPoint - currentPoint) < scaledSpeed) {
    return nextPoint;
  }
  if (currentPoint < nextPoint) {
    return currentPoint + scaledSpeed;
  } else {
    return currentPoint - scaledSpeed;
  }
};

const getPointDistanceInKm = (srcLat, srcLng, dstLat, dstLng) => {
  const deg2Rad = 0.017453292519943295; // Math.PI / 180
  const cos = Math.cos;
  const a =
    0.5 -
    cos((dstLat - srcLat) * deg2Rad) / 2 +
    (cos(srcLat * deg2Rad) *
      cos(dstLat * deg2Rad) *
      (1 - cos((dstLng - srcLng) * deg2Rad))) /
      2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

// Use this only for relative scaling. Highly divergent values for larger distances
const fastApproximateDistanceInKm = (srcLat, srcLng, dstLat, dstLng) => {
  return (
    Math.sqrt(
      Math.abs(srcLat - dstLat) * Math.abs(srcLat - dstLat) +
        Math.abs(srcLng - dstLng) * Math.abs(srcLng - dstLng)
    ) * 100
  );
};

export const getCoordDelta = (lastCoords, currentCoords, nextCoords, speed) => {
  const distanceBetweenCoords = fastApproximateDistanceInKm(
    lastCoords.lat,
    lastCoords.lng,
    nextCoords.lat,
    nextCoords.lng
  );
  const nextLat = getValidatedNextPoint(
    distanceBetweenCoords,
    lastCoords.lat,
    currentCoords.lat,
    nextCoords.lat,
    speed
  );
  const nextLng = getValidatedNextPoint(
    distanceBetweenCoords,
    lastCoords.lng,
    currentCoords.lng,
    nextCoords.lng,
    speed
  );
  return [nextLat, nextLng];
};
