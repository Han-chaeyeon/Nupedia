/**
 * MovieRepository.ts
 * RawData -> DTO Type 매핑
 * - 외부 API와 통신, HTTP 요청 수행
 * - Service에 예측 가능한 형태의 에러(404, 500 등) 던짐
 * - IMovieRepository.ts의 구현체
 * - 다른 API 사용시 Service단의 수정 필요 없게 구분
 * - 외부 데이터의 불확실성 흡수, 내부 시스템에 안정적인 DTO 공급 보장
 */

import { OmdbRawMovieSearchResponse, OmdbRawMovieSummary } from "../../api/OmdbApiRawTypes";
import { IMovieRepository } from "../../domain/movie/IMovieRepository";

const mapRawSummaryToDTO = (raw: OmdbRawMovieSummary): MovieSummaryDTO => ({
  movieId: raw.imdbID,
  title: raw.Title,
  year: parseInt(raw.Year, 10),
  type: raw.Type,
  posterUrl: raw.Poster === 'N/A' ? '' : raw.Poster,
});

