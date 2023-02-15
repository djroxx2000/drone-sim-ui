import { Level } from "./constants";

export const log = (enabledLogLevel, componentName, level, ...logBody) => {
  if (enabledLogLevel < level) {
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
      console.error(...logBody);
      break;
    default:
      console.warn("Invalid log level. Logging as info...");
      console.log(...logBody);
  }
};

export const logDisabled = () => {
  return;
};
