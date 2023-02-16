import "./ActivePath.css";
import React from "react";
import { parsePathFromPathCoords } from "../utils/ControlPanelUtils";
import { GlobalContext } from "../context/global/GlobalProvider";

function ActivePath({ pathCoords }) {
  const [state] = React.useContext(GlobalContext);
  const path = parsePathFromPathCoords(pathCoords.trim());
  React.useEffect(() => {
    const container = document.getElementsByClassName(
      "active-path-container"
    )[0];
    const currentCoord = document.getElementsByClassName("current-coord")[0];
    if (
      currentCoord.getBoundingClientRect().top -
        container.getBoundingClientRect().top >
      120
    ) {
      currentCoord.scrollIntoView();
    }
  }, [state.droneCurrentPath.length]);
  return (
    <div className="active-path-container">
      {path.map((coord, idx) => {
        return (
          <div
            key={idx}
            className={
              (state.activePath.length - state.droneCurrentPath.length == idx
                ? "current-coord"
                : "") + " active-path-coord"
            }
          >
            <div className="active-path-point">Lat:&nbsp;{coord.lat}</div>
            <div className="active-path-point">Lng:&nbsp;{coord.lng}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivePath;
