import React from 'react'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { center, performStartupOperations } from '../utils/MapUtils';
import droneIcon from '../assets/drone.svg';

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.MY_API_KEY
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    console.log("Loading map...");
    performStartupOperations(map, document);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const onPolylineLoad = (polyline) => {
    console.log(polyline);
  }

  const onMarkerLoad = (marker) => {
    console.log(marker);
  }

  const path = [
    {lat: 37.338207, lng: -121.886330},
    {lat: 37.348207, lng: -121.876330},
    {lat: 37.348207, lng: -121.866330},
    {lat: 37.338207, lng: -121.866330},
    {lat: 37.336207, lng: -121.886330},
    {lat: 37.338207, lng: -121.886330}
  ];
  
  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: [
      path
    ],
    zIndex: 1
  };
  const droneCenterRef = React.useRef({
    lat: 37.338207,
    lng: -121.886330
  });
  const [droneCenter, setDroneCenter] = React.useState(droneCenterRef.current);

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("Changing drone poss", interval, droneCenter.lat, droneCenterRef.current.lat);
      // console.log(droneCenter);
      droneCenterRef.current = {
        lat: droneCenterRef.current.lat + 0.00001,
        lng: droneCenterRef.current.lng + 0.00001,
      };
      setDroneCenter(droneCenterRef.current);
      // map.setCenter(droneCenterRef.current);
      // performStartupOperations(map, document);
    }, 50);
  }, []);

  const onMarkerPositionChanged = () => {
    console.log("marker pos changed");
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polyline
          onLoad={onPolylineLoad}
          path={path}
          options={options}
        />
        <Marker 
          onLoad={onMarkerLoad}
          onPositionChanged={onMarkerPositionChanged}
          position={droneCenter}
          icon={droneIcon} 
          label={"drone"}
        />
      </GoogleMap>
  ) : <></>
}

export default React.memo(MapContainer);