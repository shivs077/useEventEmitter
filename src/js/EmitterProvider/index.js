import React, { createContext, useMemo } from "react";
import { Subject } from "rxjs";

export const EmitterContext = createContext(null);

const EmitterProvider = ({ children, ...rest }) => {
  const observable = useMemo(() => new Subject(), []);
  return (
    <EmitterContext.Provider value={{ observable, ...rest }}>
      {children}
    </EmitterContext.Provider>
  );
};

export { EmitterProvider };
