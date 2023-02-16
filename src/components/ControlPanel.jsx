import "./ControlPanel.css";
import React from "react";
import { GlobalContext } from "../context/global/GlobalProvider";
import { useLog } from "../hooks/useLog";
import {
  TOGGLE_DRONE_MOVEMENT,
  RELOAD_PATH,
  SET_ACTIVE_PATH,
  ADD_NEW_PATH,
  Level,
} from "../utils/constants";
import {
  FaPlay,
  FaPause,
  FaHistory,
  FaPencilAlt,
  FaPlus,
  FaCheck,
} from "react-icons/fa";
import PathCoord from "./PathCoord";
import ActivePath from "./ActivePath";
import {
  parsePathFromPathCoords,
  getPathCoordsFromPath,
} from "../utils/ControlPanelUtils";

function ControlPanel() {
  const [state, dispatch] = React.useContext(GlobalContext);
  const { log } = useLog("ControlPanel");
  const [isEdit, setIsEdit] = React.useState(false);
  const toggleDroneMovement = () => {
    dispatch({ type: TOGGLE_DRONE_MOVEMENT });
  };

  const reloadPath = () => {
    dispatch({ type: RELOAD_PATH });
    setTimeout(() => {
      const currentCoord = document.getElementsByClassName("current-coord")[0];
      currentCoord.scrollIntoView();
    }, 100);
  };

  const [pathCoords, setPathCoords] = React.useState("");

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
    setIsEdit(false);
  };

  const addPath = () => {
    if (!isValidPathCoords(pathCoords.trim())) {
      return;
    }
    dispatch({
      type: ADD_NEW_PATH,
      payload: parsePathFromPathCoords(pathCoords.trim()),
    });
  };

  const clearPreviousFile = (e) => {
    e.target.value = null;
  };

  const readInputFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (isValidPathCoords(reader.result)) {
        setPathCoords(reader.result);
        dispatch({
          type: SET_ACTIVE_PATH,
          payload: parsePathFromPathCoords(reader.result.trim()),
        });
      }
    };
    reader.onerror = (e) => {
      console.error("Error reading file: ", e);
    };

    reader.readAsText(file);
  };

  const toggleEdit = () => {
    setIsEdit(true);
  };

  React.useEffect(() => {
    setPathCoords(getPathCoordsFromPath(state.activePath));
    reloadPath();
  }, [state.activePath]);

  return (
    <div className="control-panel-container">
      <div className="control-panel-header"> Simulation Control Panel</div>
      <div className="simulation-controls">
        <button className="btn-md" onClick={toggleDroneMovement}>
          {state.isDroneMovementEnabled ? (
            <div className="btn-content">
              <FaPause /> &nbsp;&nbsp; Pause
            </div>
          ) : (
            <div className="btn-content">
              <FaPlay /> &nbsp;&nbsp; Play
            </div>
          )}
        </button>
        <button className="btn-md" onClick={reloadPath}>
          <FaHistory />
          &nbsp;&nbsp;
          {"Reload"}
        </button>
      </div>

      <div className="control-panel-header">Active Path</div>
      {isEdit ? (
        <textarea
          className="textarea"
          name="pathCoords"
          cols="30"
          rows="10"
          value={pathCoords}
          onInput={(e) => setPathCoords(e.target.value)}
        ></textarea>
      ) : (
        <ActivePath pathCoords={pathCoords} />
      )}

      <div className="simulation-controls">
        {isEdit ? (
          <button className="btn-md" onClick={updatePath}>
            <FaCheck />
            &nbsp;&nbsp; Use
          </button>
        ) : (
          <button className="btn-md" onClick={toggleEdit}>
            <FaPencilAlt />
            &nbsp;&nbsp; Edit
          </button>
        )}

        <button className="btn-md" onClick={addPath}>
          <FaPlus />
          &nbsp;&nbsp; Add
        </button>
      </div>
      <div className="control-panel-header">Add Flight Path from file</div>
      <div className="path-header">
        <input
          className="file-input"
          type="file"
          name="path"
          onClick={clearPreviousFile}
          onChange={readInputFile}
        />
      </div>
      <div className="path-list-container">
        <div className="control-panel-header">Added Paths</div>
        <div className="path-list">
          {state.paths.length < 1 ? (
            <div className="empty-paths-label">No Paths Added... </div>
          ) : (
            ""
          )}
          {state.paths.map((path, idx) => {
            return <PathCoord key={idx} currentPath={path} pathIdx={idx} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
