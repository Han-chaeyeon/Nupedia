/**
 * @file MovieServiceContext.tsx
 * @description MovieService 안정적으로 제공하는 Context API
 * - Context 생성
 * - Provider: IMovieService 인스턴스 주입
 * - Hook: useMovieService를 통해 MovieService 인스턴스 가져와 Provider 유무 검증
 */

import { createContext, ReactNode, useContext } from "react";
import {IMovieService} from "../domain/movie/ImovieService"

// Context 타입 정의
const MovieServiceContext = createContext<IMovieService | null>(null);

// Provider Props 타입 정의
interface MovieServiceProviderProps {
  children: ReactNode;
  service:IMovieService;
}

export const MovieServiceProvider = ({ children, service }: MovieServiceProviderProps) => {
  return (
    <MovieServiceContext.Provider value={service}>
      {children}
    </MovieServiceContext.Provider>
  );
};

export const useMovieService = () : IMovieService => {
  const context = useContext(MovieServiceContext);
  if (context === null) {
    throw new Error("useMovieService는 MovieServiceProvider 내에서만 사용");
  }

  return context;
};

