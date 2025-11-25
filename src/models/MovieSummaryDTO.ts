/**
 * MovieSummaryDTO.ts
 * 애플리케이션 내부에서 사용되는 영화 목록 표준 DTO
 * - 내부 컨벤션(CamelCase)를 따르고, 타입을 보정해서 Service/Component에서 사용
 * - 타입 안전성을 확보하고, 느슨한 결합 지향(API 교체 시 관련 파일만 수정함)
 */

export interface MovieSummaryDTO {
  movieId: string;
  title: string;
  year: number;
  type: "movie" | "series" | "episode";
  posterUrl: string | null;
}

// 검색 응답 결과 전체 DTO
export interface MovieSearchResultDTO {
  movies: MovieSummaryDTO[];
  totalResults: number;
}
