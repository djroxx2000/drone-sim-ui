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
