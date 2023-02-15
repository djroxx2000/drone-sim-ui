import React from "react";
import {
  GoogleMap,
  Polyline,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { center, performStartupOperations } from "../utils/MapUtils";
import droneIcon from "../assets/drone.svg";
import { GlobalContext } from "../context/global/GlobalProvider";
import {
  Level,
  SET_DRONE_MOVEMENT_INTERVAL,
  UPDATE_DRONE_POSITION,
} from "../utils/constants";
import { useLog } from "../hooks/useLog";

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_FREE_API_KEY,
  });
  const [state, dispatch] = React.useContext(GlobalContext);
  const { log } = useLog("MapContainer");

  const [map, setMap] = React.useState(null);
  const firstInterval = React.useRef(null);

  const onMapLoad = React.useCallback(function callback(map) {
    log(Level.INFO, "Loading map...");
    performStartupOperations(map, document);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const onPolylineLoad = (polyline) => {
    log(Level.DEBUG, "POLYLINE: ", polyline);
  };

  const onMarkerLoad = (marker) => {
    log(Level.DEBUG, "MARKER: ", marker);
  };

  const path = [
    { lat: 37.338207, lng: -121.88633 },
    { lat: 37.348207, lng: -121.87633 },
    { lat: 37.348207, lng: -121.86633 },
    { lat: 37.338207, lng: -121.86633 },
    { lat: 37.336207, lng: -121.88633 },
    { lat: 37.338207, lng: -121.88633 },
  ];

  const options = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: [path],
    zIndex: 1,
  };

  const onMarkerPositionChanged = () => {
    log(Level.DEBUG, "Updated marker position:", state.dronePosition);
  };

  React.useEffect(() => {
    if (!map || state.droneMovementInterval != null) {
      return;
    }
    const interval = setInterval(() => {
      dispatch({
        type: UPDATE_DRONE_POSITION,
        payload: {
          latDelta: state.droneSpeed,
          lngDelta: state.droneSpeed,
        },
      });
      state.dronePosition.lat += state.droneSpeed;
      state.dronePosition.lng += state.droneSpeed;
      log(Level.DEBUG, state.dronePosition);
      map.setCenter(state.dronePosition);
    }, 1000 / state.framesPerSecond);
    log(Level.DEBUG, "Current interval: ", interval)
    // firstInterval.current = interval;
    dispatch({
      type: SET_DRONE_MOVEMENT_INTERVAL,
      payload: interval,
    });
  }, [map])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onMapLoad}
      onUnmount={onUnmount}
    >
      <Polyline onLoad={onPolylineLoad} path={path} options={options} />
      <Marker
        onLoad={onMarkerLoad}
        onPositionChanged={onMarkerPositionChanged}
        position={state.dronePosition}
        icon={droneIcon}
        label={"drone"}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);
