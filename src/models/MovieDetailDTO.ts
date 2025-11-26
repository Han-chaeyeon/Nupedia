/**
 * MovieDetailDTO.ts
    영화 상세 정보를 위한 표준 DTO
    - 데이터의 표준화(외부 API를 프론트엔드에서 사용하는 일관된 포맷으로 변환)
    - 데이터 전송 컨테이너, 데이터 형태 문서화
    - 매핑 처리는 Repository에서
 */
/**
 * @typedef {object} MovieDetailDTO - 영화 상세 정보를 위한 내부 표준 DTO
 * @property {string} imdbId - IMDB 고유 ID.
 * @property {string} title - 영화 제목.
 * @property {number} year - 개봉 연도. (문자열 '1999'를 숫자 1999로 변환 가정)
 * @property {?string} posterUrl - 포스터 이미지 URL. ('N/A'일 경우 null)
 * @property {string} plot - 영화 줄거리 (full plot).
 * @property {string} director - 감독 이름.
 * @property {string} runtime - 상영 시간 (예: "120 min").
 * @property {string} actors - 주요 배우들.
 * @property {string} genre - 장르 (쉼표로 구분된 문자열).
 * @property {string} language - 언어.
 * @property {string} country - 국가.
 * @property {number|null} imdbRating - IMDB 평점 (예: "8.5").
 * @property {string} rated - 관람 등급 (예: "PG-13").
 * @property {string} released - 개봉일 (원시 문자열).
 */
export interface MovieDetailDTO {
  movieId: string;
  title: string;
  writer: string;
  year: number;
  plot: string;
  director: string;
  runtime: string;
  actors: string;
  genre: string;
  language: string;
  country: string;
  rated: string;
  released: string;
  
  metascore: number | null;
  posterUrl: string | null;
  imdbVotes: number | null; // 내부 연산용
  imdbRating: number | null;
  ratings: RatingDTO[] | null;

  boxOffice?: string | null;
  production?: string | null;
  website?: string | null;
}

export interface RatingDTO {
  source: string;
  value: number | null;
  max: number;
}
