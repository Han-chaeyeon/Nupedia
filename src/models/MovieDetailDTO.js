/**
 * @typedef {object} MovieDetailDto - 영화 상세 정보를 위한 내부 표준 DTO
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
 * @property {string} imdbRating - IMDB 평점 (예: "8.5").
 * @property {string} rated - 관람 등급 (예: "PG-13").
 * @property {string} released - 개봉일 (원시 문자열).
 */

export class MovieDetailDto {}
