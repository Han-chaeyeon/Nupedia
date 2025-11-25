/**
 * OMdbApiRawTypes.ts
 * API 응답 Raw 타입 정의
 * - API에서 그대로 받아오는 RawData의 타입 정의
 * - API 응답 필드 이름이나 타입이 변경될 경우 현재 파일만 수정
 */

export interface OmdbRawMovieSummary {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

export interface OmdbRawMovieSearchResponse {
  Search: OmdbRawMovieSummary[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

export interface OmdbRawMovieDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  imdbId: string;
  Poster: string;
  Response: "True" | "False";
  Error?: string;
}
