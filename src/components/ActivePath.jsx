import "./ActivePath.css";
import React from "react";
import { parsePathFromPathCoords } from "../utils/ControlPanelUtils";
import { GlobalContext } from "../context/global/GlobalProvider";

function ActivePath({ pathCoords }) {
  const [state, dispatch] = React.useContext(GlobalContext);
  const path = parsePathFromPathCoords(pathCoords.trim());
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
