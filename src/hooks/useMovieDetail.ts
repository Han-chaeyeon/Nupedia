/**
 * @file useMovieDetail.ts
 * @description 특정 IMDb ID 기반으로 영화 상세정보를 비동기로 로드하는 커스텀 훅
 * - 에러, 로딩, 데이터 상태 관리 및 UI 제공
 * - 상태관리 : MovieDetailView(데이터) | null, boolean(로딩), string|null(에러)
 * - 의존성 소비 : useMovieService를 통해 IMovieService 인스턴스 불러옴
 * - 에러 변환: Service 계층(MovieNotFoundError, RepositoryError) 에러 관리
 * @returns {UseMovieDetailResult} : 상세정보 상태와 제어 함수 포함
 */
import { useState, useCallback } from "react";
import {
  MovieNotFoundError,
  InvalidInputError,
} from "../common/errors/DomainError.js";
import { useMovieService } from "../service/MovieServiceContext.jsx";
import { MovieDetailView } from "../models/MovieDetailView"

// 상세정보 상태 객체 타입 정의
export interface UseMovieDetailResult {
  selectedMovie: MovieDetailView | null;
  detailLoading: boolean;
  error: string|null;
  fetchMovieDetail: (imdbId:string) => Promise<void>;
  clearDetail: () => void;
}

const useMovieDetail = (): UseMovieDetailResult => {
  const movieService = useMovieService();
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailView | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상세 정보 조회 함수
  const fetchMovieDetail = useCallback(
    async (imdbId : string) => {
      if (!imdbId) return;

      setDetailLoading(true);
      setError(null);

      try {
        // Service 계층의 상세 정보 조회 메서드 호출
        const result = await movieService.getMovieDetailById(imdbId);
        setSelectedMovie(result); // 상세 정보 모달을 띄우기 위한 데이터 저장
      } catch (e) {
        console.log("Movie Detail Fetch Error", e);

        const isErrorWithPropertis = (error: unknown):error is {name:string, message:string} => {
          return typeof error === 'object' && error !== null && 'name' in error && 'message' in error;
        }

        if(isErrorWithPropertis(e)) {
          if (e.name === "MovieNotFoundError" || e.name === "InvalidInputError") {
          // 404, 400
          setError(e.message);
        } else if (e.name === "RepositoryError") {
          // 503
          setError("영화 데이터 가져오는 중 외부 시스템 오류 발생");
        } else {
          // 500
          console.log("Uncaught Service Error :", e);
          setError("상세정보 조회 중 오류 발생");
        }
        } else {
          console.log("Unclassified Error: ", e);
          setError("알 수 없는 시스템 오류 발생")
        }
        
        setSelectedMovie(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [movieService]
  );

  // 상세 정보 상태 초기화 (모달 닫기용)
  const clearDetail = useCallback(() => {
    setSelectedMovie(null);
    setError(null);
  }, []);

  return {
    selectedMovie,
    detailLoading,
    error,
    fetchMovieDetail,
    clearDetail,
  };
};

export default useMovieDetail;
