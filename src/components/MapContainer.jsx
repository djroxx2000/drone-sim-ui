import React from "react";
import {
  GoogleMap,
  Polyline,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import {
  center,
  performStartupOperations,
  mapContainerStyle,
  polyLineOptions,
  getCoordDelta,
} from "../utils/MapUtils";
import droneIcon from "../assets/drone.svg";
import { GlobalContext } from "../context/global/GlobalProvider";
import {
  Level,
  SET_DRONE_MOVEMENT_INTERVAL,
  UPDATE_DRONE_POSITION,
  SET_NEXT_COORDS,
  CLEAR_DRONE_MOVEMENT_INTERVAL,
  RELOAD_COORDS,
} from "../utils/constants";
import { useLog } from "../hooks/useLog";

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MY_API_KEY,
  });
  const [state, dispatch] = React.useContext(GlobalContext);
  const { log } = useLog("MapContainer");

  const [map, setMap] = React.useState(null);

  const onMapLoad = React.useCallback(function callback(map) {
    log(Level.INFO, "Loading map...");
    performStartupOperations(map, document);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(_) {
    setMap(null);
  }, []);

  const onPolylineLoad = (polyline) => {
    log(Level.DEBUG, "POLYLINE:\n", polyline);
  };

  const onMarkerLoad = (marker) => {
    log(Level.DEBUG, "MARKER:\n", marker);
  };

  const onMarkerPositionChanged = () => {
    log(Level.DEBUG, "Marker position changed:\n", state.dronePosition);
  };

  React.useEffect(() => {
    if (
      !map ||
      state.droneMovementInterval != null ||
      !state.isDroneMovementEnabled
    ) {
      return;
    }
    if (
      state.dronePosition.lat == state.nextCoords.lat &&
      state.dronePosition.lng == state.nextCoords.lng
    ) {
      dispatch({
        type: SET_NEXT_COORDS,
      });
      return;
    }
    const interval = setInterval(() => {
      const [nextLat, nextLng] = getCoordDelta(
        state.lastCoords,
        state.dronePosition,
        state.nextCoords,
        state.droneSpeed
      );
      dispatch({
        type: UPDATE_DRONE_POSITION,
        payload: {
          nextLat,
          nextLng,
        },
      });
      state.dronePosition.lat = nextLat;
      state.dronePosition.lng = nextLng;
      log(Level.DEBUG, state.dronePosition);
      // map.setCenter(state.dronePosition);

      if (
        state.dronePosition.lat == state.nextCoords.lat &&
        state.dronePosition.lng == state.nextCoords.lng
      ) {
        dispatch({ type: SET_NEXT_COORDS });
        dispatch({ type: CLEAR_DRONE_MOVEMENT_INTERVAL });
      }
    }, 1000 / state.framesPerSecond);

    dispatch({
      type: SET_DRONE_MOVEMENT_INTERVAL,
      payload: interval,
    });
  }, [map, state.nextCoords]);

  React.useEffect(() => {
    log(Level.DEBUG, "Toggled isDroneMovementEnabled");
    if (state.isDroneMovementEnabled && state.droneMovementInterval == null) {
      dispatch({ type: RELOAD_COORDS });
    } else {
      dispatch({ type: CLEAR_DRONE_MOVEMENT_INTERVAL });
    }
  }, [state.isDroneMovementEnabled]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={15}
      onLoad={onMapLoad}
      onUnmount={onUnmount}
    >
      <Polyline
        onLoad={onPolylineLoad}
        path={state.activePath}
        options={polyLineOptions}
      />
      <Marker
        onLoad={onMarkerLoad}
        onPositionChanged={onMarkerPositionChanged}
        position={state.dronePosition}
        icon={droneIcon}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);
