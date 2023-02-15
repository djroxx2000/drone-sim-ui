import React from "react";
import droneIcon from "../assets/drone.png";
import { GlobalContext } from "../context/global/GlobalProvider";
import { useLog } from "../hooks/useLog";
import {
  TOGGLE_DRONE_MOVEMENT,
  RELOAD_PATH,
  SET_ACTIVE_PATH,
  Level,
} from "../utils/constants";

function ControlPanel() {
  const [state, dispatch] = React.useContext(GlobalContext);
  const { log } = useLog("ControlPanel");
  const toggleDroneMovement = () => {
    dispatch({ type: TOGGLE_DRONE_MOVEMENT });
  };

  const reloadPath = () => {
    dispatch({ type: RELOAD_PATH });
  };

  const [pathCoords, setPathCoords] = React.useState("");

  const getPathCoordsFromPath = (path) => {
    let textPath = "";
    for (let coord of path) {
      textPath += coord.lat + ", " + coord.lng + "\n";
    }
    return textPath;
  };

  const parsePathFromPathCoords = (coords) => {
    const path = [];
    const coordsList = coords.split("\n");
    for (const coord of coordsList) {
      const [lat, lng] = coord.split(",").map(parseFloat);
      path.push({ lat, lng });
    }
    return path;
  };

  const isValidPathCoords = (pathCoords) => {
    const regexPattern =
      /^(([+-]?[0-9]+\.)?[+-]?[0-9]+,[ ]*([+-]?[0-9]+\.)?[+-]?[0-9]+[\r\n|\r|\n]*)+$/;
    if (!regexPattern.test(pathCoords)) {
      log(
        Level.ERROR,
        "Invalid Path Coord format. Please follow required format (123.123, 123.123\\n)"
      );
      return false;
    } else {
      return true;
    }
  };

  const updatePath = () => {
    if (!isValidPathCoords(pathCoords.trim())) {
      //handle form error
      return;
    }
    dispatch({
      type: SET_ACTIVE_PATH,
      payload: parsePathFromPathCoords(pathCoords.trim()),
    });
  };

  const readInputFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (isValidPathCoords(reader.result)) {
        setPathCoords(reader.result);
      }
    };
    reader.onerror = (e) => {
      console.log("Error reading file: ", e);
    };

    reader.readAsText(file);
  };

  React.useEffect(() => {
    setPathCoords(getPathCoordsFromPath(state.activePath));
    reloadPath();
  }, [state.activePath]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img width="100px" height="100px" src={droneIcon} alt="" />
        <button onClick={toggleDroneMovement}>Play/Pause</button>
        <button onClick={reloadPath}>Reload</button>
        <textarea
          name="pathCoords"
          cols="30"
          rows="10"
          value={pathCoords}
          onInput={(e) => setPathCoords(e.target.value)}
        ></textarea>
        <button onClick={updatePath}>Update Path</button>
        <input type="file" name="path" onChange={readInputFile} />
      </div>
    </div>
  );
}

export default ControlPanel;
