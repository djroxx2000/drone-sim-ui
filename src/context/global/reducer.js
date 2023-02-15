import {
  UPDATE_DRONE_POSITION,
  SET_DRONE_MOVEMENT_INTERVAL,
  CLEAR_DRONE_MOVEMENT_INTERVAL,
  Level,
} from "../../utils/constants";

export const reducer = (state, action) => {
  if (state.enabledLogLevel >= Level.DEBUG) {
    console.log(action.type, action.payload);
  }
  switch (action.type) {
    case UPDATE_DRONE_POSITION:
      return {
        ...state,
        dronePosition: {
          lat: state.dronePosition.lat + action.payload.latDelta,
          lng: state.dronePosition.lng + action.payload.lngDelta,
        },
      };
    case SET_DRONE_MOVEMENT_INTERVAL:
      state.droneMovementInterval = action.payload;
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
  dronePosition: {
    lat: 37.338207,
    lng: -121.88633,
  },
  nextCoords: null,
  droneMovementInterval: null,
  enabledLogLevel: Level.DEBUG,
  droneSpeed: 0.0001,
  framesPerSecond: 0.25,
};
