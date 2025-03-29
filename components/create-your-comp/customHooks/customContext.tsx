import { createContext, useState } from "react";

const customContext = createContext({});

export const customContextProvider = ({ children }: any) => {
  const [data, setData] = useState("initial data");

  const updateData = (newData: any) => {
    setData(newData);
  };

  const contextValue = {
    data,
    updateData,
  };

  return (
    <customContext.Provider value={contextValue}>
      {children}
    </customContext.Provider>
  );
};
