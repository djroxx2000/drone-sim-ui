import React from "react";
import { GlobalContext } from "../context/global/GlobalProvider";
import { Level } from "../utils/constants";

export const useLog = (componentName) => {
  const [state, _] = React.useContext(GlobalContext);

  const isLogLevelEnabled = (level) => {
    return state.enabledLogLevel >= level;
  }

  const logEnabled = (level, ...logBody) => {
    if(!isLogLevelEnabled(level)) {
        return;
    }
    logBody.unshift(componentName);
    switch (level) {
      case Level.INFO:
        console.log(...logBody);
        break;
      case Level.DEBUG:
        console.log(...logBody);
        break;
      case Level.WARN:
        console.warn(...logBody);
        break;
      case Level.ERROR:
        console.warn(...logBody);
        break;
      default:
        console.warn("Invalid log level. Logging as info...");
        console.log(...logBody);
    }
  };

  const logDisabled = () => {
    return;
  };

  return state.enabledLogLevel !== Level.NONE
    ? {
        log: logEnabled,
      }
    : {
        log: logDisabled,
      };
};
