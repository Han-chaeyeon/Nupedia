import { useState, useCallback } from "react";
import {
  MovieNotFoundError,
  InvalidInputError,
} from "../components/common/errors/DomainError";
import { useMovieService } from "../service/MovieServiceContext.jsx";

/**
 * 영화 상세 정보를 로드하고 상태를 관리하는 커스텀 훅
 * @returns {object} { selectedMovie, detailLoading, error, fetchMovieDetail, clearDetail }
 */
const useMovieDetail = () => {
  const movieService = useMovieService();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  // 상세 정보 조회 함수
  const fetchMovieDetail = useCallback(
    async (imdbId) => {
      if (!imdbId) return;

      setDetailLoading(true);
      setError(null);

      try {
        // Service 계층의 상세 정보 조회 메서드 호출
        const result = await movieService.getMovieDetailById(imdbId);
        setSelectedMovie(result); // 상세 정보 모달을 띄우기 위한 데이터 저장
      } catch (e) {
        console.log("Movie Detail Fetch Error", e);
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
