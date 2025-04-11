import { createContext, useState } from "react";

const customContext = createContext({});

export const customContextProvider = ({ children }: any) => {
  // const [data, setData] = useState("initial data");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  // const updateData = (newData: any) => {
  //   setData(newData);
  // };

  const contextValue = {
    // data,
    isLoading,
    isFetching,
    setIsLoading,
    setIsFetching,
    // updateData,
  };

  return (
    <customContext.Provider value={contextValue}>
      {children}
    </customContext.Provider>
  );
};
