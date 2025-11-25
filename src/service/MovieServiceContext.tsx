import { createContext, useContext } from "react";

const MovieServiceContext = createContext(null);

export const MovieServiceProvider = ({ children, service }) => {
  return (
    <MovieServiceContext.Provider value={service}>
      {children}
    </MovieServiceContext.Provider>
  );
};

export const useMovieService = () => {
  const context = useContext(MovieServiceContext);
  if (context === null) {
    throw new Error("useMovieService는 MovieServiceProvider 내에서만 사용");
  }

  return context;
};

export default MovieServiceContext;
