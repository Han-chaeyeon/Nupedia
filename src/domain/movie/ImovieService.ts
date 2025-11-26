/**
 * IMovieService.ts
 * 비즈니스 로직 정의 인터페이스
 * - 비즈니스 로직 가이드라인 제공
 * - 프리젠테이션 계층(웹 컨트롤러, API 라우터)이 의존
 */

import { MovieDetailDTO } from "../../models/MovieDetailDTO";
import { MovieDetailView } from "../../models/MovieDetailView";
import { MovieSearchResultDTO } from "../../models/MovieSummaryDTO"

export interface IMovieService {
    /**
     * 목록 검색 기능 제공
     * - 비즈니스 로직 포함(쿼리 검증, 기본값 설정)
     * @params query 검색어(null 허용)
     * @params page 페이지 번호
     * @return {movies: MovieSummaryDTO[], totalResults: number}
     */
    searchMovieCollection(query:string | null, page: number): Promise<MovieSearchResultDTO>;

    /**
     * ID 조회로 상세정보 추출
     * - 비즈니스 로직 포함
     * @params movieId 영화 고유값(imdbId)
     * @return MovieDetailView 형태의 가공된 객체(MovieDetailDTO, genres 포함)
     */
    getMovieDetailById(movieId: string): Promise<MovieDetailView>;
}