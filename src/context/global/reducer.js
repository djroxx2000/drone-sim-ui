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
} from "../../utils/constants";
import { initialPath } from "../../utils/MapUtils";

export const reducer = (state, action) => {
  if (state.enabledLogLevel >= Level.DEBUG) {
    console.debug(action.type, action.payload);
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
      // state.droneMovementInterval = action.payload;
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
        return state;
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
  droneSpeed: 0.0001,
  framesPerSecond: 10,
  activePath: initialPath,
  droneCurrentPath: initialPath,
  isDroneMovementEnabled: false,
  lastCoords: initialPath[0],
};
