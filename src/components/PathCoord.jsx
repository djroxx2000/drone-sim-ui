import "./PathCoord.css";
import React from "react";
import { REMOVE_PATH, SET_ACTIVE_PATH } from "../utils/constants";
import { GlobalContext } from "../context/global/GlobalProvider";

function PathCoord({ currentPath, pathIdx }) {
  const [state, dispatch] = React.useContext(GlobalContext);

  const setActive = () => {
    dispatch({
      type: SET_ACTIVE_PATH,
      payload: state.paths[pathIdx],
    });
  };

  const removePath = () => {
    dispatch({
      type: REMOVE_PATH,
      payload: {
        pathIdx: pathIdx,
      },
    });
  };

  return (
    <div className="coord-container">
      <div className="coord-controls">
        #{pathIdx + 1}
        <div className="coord-controls-right">
          <button className="btn-md" onClick={setActive}>
            Set Active
          </button>
          <button className="btn-md" onClick={removePath}>
            Remove
          </button>
        </div>
      </div>
      {currentPath.map((coord, idx) => (
        <div key={idx} className="coord">
          <div className="coord-point">Lat: {coord.lat}</div>
          <div className="coord-point">Lng: {coord.lng}</div>
        </div>
      ))}
    </div>
  );
}

export default PathCoord;
