import {
  UPDATE_DRONE_POSITION,
  SET_DRONE_MOVEMENT_INTERVAL,
  CLEAR_DRONE_MOVEMENT_INTERVAL,
  Level,
  SET_NEXT_COORDS,
  RELOAD_COORDS,
  TOGGLE_DRONE_MOVEMENT,
  RELOAD_PATH,
  SET_ACTIVE_PATH,
  ADD_NEW_PATH,
  REMOVE_PATH,
} from "../../utils/constants";
import { log } from "../../utils/logUtils";
import { initialPath } from "../../utils/MapUtils";

export const reducer = (state, action) => {
  if (state.enabledLogLevel >= Level.DEBUG) {
    console.log(action.type, action.payload);
  }
  switch (action.type) {
    case UPDATE_DRONE_POSITION:
      return {
        ...state,
        dronePosition: {
          lat: action.payload.nextLat,
          lng: action.payload.nextLng,
        },
      };
    case SET_DRONE_MOVEMENT_INTERVAL:
      return {
        ...state,
        droneMovementInterval: action.payload,
      };
    case CLEAR_DRONE_MOVEMENT_INTERVAL:
      clearInterval(state.droneMovementInterval);
      return {
        ...state,
        droneMovementInterval: null,
      };
    case SET_NEXT_COORDS:
      if (state.droneCurrentPath.length <= 1) {
        return {
          ...state,
        };
      }
      const [lastCoords, ...updatedPath] = state.droneCurrentPath;
      return {
        ...state,
        droneCurrentPath: updatedPath,
        lastCoords,
        nextCoords: updatedPath[0],
      };
    case RELOAD_COORDS:
      state.nextCoords = { ...state.nextCoords };
      return {
        ...state,
        nextCoords: {
          ...state.nextCoords,
        },
      };
    case TOGGLE_DRONE_MOVEMENT:
      return {
        ...state,
        isDroneMovementEnabled: !state.isDroneMovementEnabled,
      };
    case RELOAD_PATH:
      clearInterval(state.droneMovementInterval);
      return {
        ...state,
        droneCurrentPath: [...state.activePath],
        isDroneMovementEnabled: false,
        droneMovementInterval: null,
        dronePosition: {
          ...state.activePath[0],
        },
        nextCoords: {
          ...state.activePath[0],
        },
      };
    case SET_ACTIVE_PATH:
      clearInterval(state.droneMovementInterval);
      return {
        ...state,
        activePath: [...action.payload],
        droneCurrentPath: [...action.payload],
        droneMovementInterval: null,
        dronePosition: {
          ...action.payload[0],
        },
        nextCoords: {
          ...action.payload[0],
        },
      };
    case ADD_NEW_PATH:
      return {
        ...state,
        paths: [...state.paths, [...action.payload]],
      };
    case REMOVE_PATH:
      const updatedPaths = [...state.paths];
      updatedPaths.splice(action.payload.pathIdx, 1);
      return {
        ...state,
        paths: [...updatedPaths],
      };
    default:
      console.error("Dispatch action not recognized");
      return state;
  }
};

export const initialState = {
  mapCenter: {
    lat: 37.338207,
    lng: -121.88633,
  },
  dronePosition: initialPath[0],
  nextCoords: initialPath[0],
  droneMovementInterval: null,
  enabledLogLevel: Level.INFO,
  droneSpeed: 0.0005,
  framesPerSecond: 10,
  activePath: initialPath,
  droneCurrentPath: initialPath,
  isDroneMovementEnabled: false,
  lastCoords: initialPath[0],
  paths: [],
};
