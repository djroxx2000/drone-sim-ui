import React from "react";
import { GlobalContext } from "../context/global/GlobalProvider";
import { Level } from "../utils/constants";
import { log, logDisabled } from "../utils/logUtils";

export const useLog = (componentName) => {
  const [state, _] = React.useContext(GlobalContext);

  return state.enabledLogLevel !== Level.NONE
    ? {
        log: (...args) => log(state.enabledLogLevel, componentName, ...args),
      }
    : {
        log: logDisabled,
      };
};
