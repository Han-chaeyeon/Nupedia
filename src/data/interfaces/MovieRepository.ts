/**
 * MovieRepository.ts
 * IMovieRepository.ts의 구현체
 * - 외부 API와 통신, HTTP 요청 수행
 * - Service에 예측 가능한 형태의 에러(404, 500 등) 던짐
 * - RawData -> DTO Type 매핑
 * - 다른 API 사용시 Service단의 수정 필요 없게 구분
 * - 외부 데이터의 불확실성 흡수, 내부 시스템에 안정적인 DTO 공급 보장
 */

import axios, { Axios, AxiosResponse } from "axios";
import {
  OmdbRawMovieDetailResponse,
  OmdbRawMovieSearchResponse,
  OmdbRawMovieSummary,
  OmdbRawRating,
} from "../../api/OmdbApiRawTypes";
import { IMovieRepository } from "../../domain/movie/IMovieRepository";
import { MovieDetailDTO, RatingDTO } from "../../models/MovieDetailDTO";
import {
  MovieSearchResultDTO,
  MovieSummaryDTO,
} from "../../models/MovieSummaryDTO";
import { OMDB_BASE_URL } from "../../config";
import {
  MovieNotFoundError,
  RepositoryError,
} from "../../common/errors/DomainError";

export class MovieRepository implements IMovieRepository {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // 영화 검색, 목록 노출용 API
  public async searchMovies(
    query: string,
    page: number = 1
  ): Promise<MovieSearchResultDTO> {
    try {
      const response: AxiosResponse<OmdbRawMovieSearchResponse> =
        await axios.get(OMDB_BASE_URL, {
          params: {
            apikey: this.apiKey,
            s: query,
            page: page,
            type: "movie",
          },
        });

      const rawData: OmdbRawMovieSearchResponse = response.data;

      if (rawData.Response === "False") {
        if (rawData.Error === "Movie not found") {
          throw new MovieNotFoundError(
            `${query}에 대한 영화 검색 결과를 찾을 수 없습니다.`
          );
        }

        throw new RepositoryError(
          `OMDb API 오류 발생: ${rawData.Error}`,
          rawData.Error
        );
      }

      const movieSummaryList: MovieSummaryDTO[] = rawData.Search.map(
        this.mapRawSummaryToDTO
      );
      const totalResultsRaw = parseInt(rawData.totalResults, 10);

      return {
        movies: movieSummaryList,
        totalResults: isNaN(totalResultsRaw) ? 0 : totalResultsRaw,
      };
    } catch (error) {
      if (
        error instanceof MovieNotFoundError ||
        error instanceof RepositoryError
      ) {
        throw error;
      }
      throw new RepositoryError(
        `목록 검색 중 알 수 없는 오류 발생(Query: ${query})`,
        error as Error
      );
    }
  }

  // 상세 정보 불러오는 API
  public async getMovieById(imdbId: string): Promise<MovieDetailDTO> {
    try {
      const response: AxiosResponse<OmdbRawMovieDetailResponse> =
        await axios.get(OMDB_BASE_URL, {
          params: {
            apikey: this.apiKey,
            i: imdbId,
            r: "json",
            plot: "full",
          },
        });

      const rawData: OmdbRawMovieDetailResponse = response.data;

      if (rawData.Response === "False") {
        if (
          rawData.Error === "Incorrect IMDb ID." ||
          rawData.Error === "Movie not Found"
        ) {
          throw new MovieNotFoundError(
            `ID ${imdbId}에 해당하는 영화를 찾을 수 없습니다.`
          );
        }

        throw new RepositoryError(`OMDb API 오류 발생:`, rawData.Error);
      }

      return this.mapRawDetailToDTO(rawData);
    } catch (error) {
      if (
        error instanceof MovieNotFoundError ||
        error instanceof RepositoryError
      ) {
        throw error;
      }

      throw new RepositoryError(
        `ID 조회 중 네트워크 또는 알 수 없는 오류 발생 (ID: ${imdbId})`,
        error as Error
      );
    }
  }

  // 어댑터 함수: RawDTO -> 내부 DTO 보정
  // 목록 타입 매핑
  private mapRawSummaryToDTO = (raw: OmdbRawMovieSummary): MovieSummaryDTO => {
    // DTO에서 정의한 규칙을 만족시키기 위한 로직
    const yearValue = parseInt(raw.Year, 10);

    return {
      movieId: raw.imdbID,
      title: raw.Title,
      year: isNaN(yearValue) ? 0 : yearValue,
      type: raw.Type,
      posterUrl: raw.Poster === "N/A" ? null : raw.Poster,
    };
  };

  // 어댑터 함수: RawDTO -> 내부 DTO 보정
  // 상세정보 타입 매핑
  private mapRawDetailToDTO = (
    raw: OmdbRawMovieDetailResponse
  ): MovieDetailDTO => {
    // number 타입으로 파싱
    const yearValue = this.safeParseInt(raw.Year);
    const metascoreValue = this.safeParseInt(raw.Metascore);
    const imdbVotesValue = this.safeParseInt(raw.imdbVotes);
    
    const imdbRatingRaw = !raw.imdbRating || raw.imdbRating === "N/A" ? null : parseFloat(raw.imdbRating);
    const imdbRatingValue = imdbRatingRaw === null || isNaN(imdbRatingRaw) ? null : imdbRatingRaw;

    const ratingsValue = raw.Ratings?.length ? raw.Ratings.map(this.mapRawRatingToDTO) : null;
    const rawBoxOfficeValue = raw.BoxOffice;
    let boxOfficeCleaned: string | null = null;
    if(rawBoxOfficeValue && rawBoxOfficeValue !== "N/A") {
      boxOfficeCleaned = rawBoxOfficeValue.replace(/[$,\s]/g, "");
    }

    return {
      movieId: raw.imdbID,
      title: raw.Title,
      year: yearValue !== null ? yearValue : 0,
      posterUrl: raw.Poster === "N/A" ? null : raw.Poster,
      plot: raw.Plot,
      director: raw.Director,
      runtime: raw.Runtime,
      actors: raw.Actors,
      genre: raw.Genre,
      language: raw.Language,
      country: raw.Country,
      rated: raw.Rated,
      released: raw.Released,
      writer: raw.Writer,
      metascore: metascoreValue,
      imdbVotes: imdbVotesValue,
      ratings: ratingsValue,
      imdbRating: imdbRatingValue,

      // optional
      boxOffice: boxOfficeCleaned,
      production: raw.Production === "N/A" ? null : raw.Production,
      website: raw.Website === "N/A" ? null : raw.Website,
    };
  };

  // ratings 매핑 어댑터 함수
  private mapRawRatingToDTO = (rawRating: OmdbRawRating):RatingDTO => {
    let value: number | null = null;
    let max = 0;

    if(rawRating.Value !== "N/A") {
      const parts = rawRating.Value.split("/");

      if(rawRating.Value.includes("%")) {
        value = this.safeParseInt(rawRating.Value.replace("%", ""));
        max= 100;
      } else if(parts.length === 2) {
        value = parseFloat(parts[0]); // 평점은 소수점 허용

        max = parseInt(parts[1], 10);
        max = isNaN(max) ? 10 : max;

        value = isNaN(value) ? null : value;
      } else {
        value = null;
        max = 0;
      }
    }

    return {
      source: rawRating.Source,
      value: value,
      max: max,
    };
  };

  // N/A 보정 함수
  private safeParseInt = (value: string): number | null => {
    if(value === "N/A" || !value) {
      return null;
    }
    const cleanedValue = value.replace(/,/g, "");
    const parsed = parseInt(cleanedValue, 10);
    return isNaN(parsed) ? null : parsed;
  }
}
