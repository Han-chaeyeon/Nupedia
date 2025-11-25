/**
 * IMovieRepository.ts
 * 타입 계층화를 위한 인터페이스 정의
 * - Service 계층과 Repository 구현체 사이의 의존성 경계 설정(추상화)
 * - MovieRepository.ts의 인터페이스
 */
import { OmdbRawMovieDetailResponse, OmdbRawMovieSearchResponse } from '../../api/OmdbApiRawTypes';




export interface IMovieRepository {
    /**
     * IMDB ID 기반 영화 상세 정보 조회
     * @params imdb 영화의 IMDB ID
     * @returns OMDBRawMovieDetailResponse 타입의 Promise
     */
    getMovieById(imdbId: string): Promise<OmdbRawMovieDetailResponse>;

    /**
     * 검색어, 페이지 기반 영화 목록 조회
     * @param query 검색어
     * @param page 페이지 번호
     * @return OmdbRawMovieSearchResponse 타입의 Promise
     */
    searchMovies(query: string, page: number): Promise<OmdbRawMovieSearchResponse>;
}