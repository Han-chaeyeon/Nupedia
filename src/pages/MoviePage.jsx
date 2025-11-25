import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import HomePage from "./HomePage";
import SearchResults from "../components/SearchResults";
import { useMovieService } from "../service/MovieServiceContext";
import {
  DomainError,
  RepositoryError,
} from "../components/common/errors/DomainError.js";

function MoviePage({ onMovieSelect, initialSearchQuery }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); //  현재 검색어 저장
  const [currentPage, setCurrentPage] = useState(1); //  현재 페이지 상태
  const [totalResults, setTotalResults] = useState(0); //  총 결과 수 상태
  const movieService = useMovieService(); // context

  // 검색 실행 함수
  const fetchMovies = async (query, page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await movieService.searchMovieCollection(query, page);
      setMovies(result.movies);
      setTotalResults(result.totalResults ? parseInt(result.totalResults) : 0);
    } catch (e) {
      if (e instanceof DomainError) {
        setError(e.message);
      } else if (e instanceof RepositoryError) {
        setError("영화 데이터를 가져오는 중 외부 시스템 오류");
      } else {
        setError("영화 검색 중 알 수 없는 시스템 오류");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // App에서 받은 초기 검색어(또는 전역 검색어)가 있다면 검색 실행
    if (initialSearchQuery && initialSearchQuery !== searchQuery) {
      setSearchQuery(initialSearchQuery);
      setCurrentPage(1);
      fetchMovies(initialSearchQuery, 1);
    }
  }, [initialSearchQuery]); // initialSearchQuery가 변경될 때마다 실행

  // 상세 정보 조회 로직 (MovieCard 클릭 시)
  const handleCardClick = (imdbId) => {
    if (onMovieSelect) {
      onMovieSelect(imdbId);
    }
  };

  // 페이지 버튼 클릭 시
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchMovies(searchQuery, newPage);
    console.log("new page", newPage);
  };

  // 페이지네이션 UI 추가
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div style={{ padding: "20px" }}>
      <>
        {/* 3. 로딩 상태 표시 */}
        {loading && <LoadingSpinner />}
        {searchQuery && !loading && !error && movies.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <p>
              '{searchQuery}'에 대한 검색 결과가 없습니다. 다른 검색어로 시도해
              보세요.
            </p>
          </div>
        )}
        

        {searchQuery && !loading && error && (
          <div
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#fee2e2",
              borderRadius: "8px",
            }}
          >
            <p>검색 중 오류가 발생했습니다: {error}</p>
          </div>
        )}

        {/* 4. 장르별 섹션 (검색어가 비어있고 로딩 중이 아닐 때) */}
        {!searchQuery && !loading && (
          <HomePage
            movieService={movieService}
            onMovieSelect={handleCardClick}
          />
        )}

        {/* 5. 검색 결과 그리드 (searchQuery가 있을 때) */}
        {searchQuery && (
          <SearchResults
            movies={movies}
            searchQuery={searchQuery}
            onMovieSelect={handleCardClick}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </>
    </div>
  );
}

export default MoviePage;
