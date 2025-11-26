import { MovieDetailDTO } from "./MovieDetailDTO";

/**
 * MovieDetailView.ts
 * UI에서 소비하기 위한 Service 계층에서 가공된 최종 상세 정보타입
 * - MoiveDetailDTO의 모든 필드 포함
 * - UI에서 사용하기 쉬운 형태로 가공하여 제공
 */

/**
 * MovieDetailView
 * 상세 정보 불러오기 위한 view 정의
 */
export interface MovieDetailView extends Omit<MovieDetailDTO,
'genre' | 'actors' | 'runtime' | 'imdbVotes' | 'released' | 'boxOffice'> {
    // DTO 필드 가공하여 배열로 넣어 대체
    genres: string[]; // 장르
    actors: string[]; // 배우
    // 포맷팅
    imdbVotesFormatted: string | null; // 숫자 -> 쉼표("1,234,567")
    runTimeFormatted: string | null; // 숫자 -> 문자열 포맷팅("120 min")
    boxOfficeFormatted: string | null; // 숫자 -> 문자열 포맷팅 ("5억 달러")
    posterUrl: string | null;
    
    releasedFormatted: string; // 날짜 -> 로컬 형식으로 포맷팅("1234년 5월 67일")
}