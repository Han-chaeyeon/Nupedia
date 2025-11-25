import axios from "axios";
import { OMDB_BASE_URL } from "../config.js";
import { MovieRepository } from "./interfaces/MovieRepository.js";
import {
  MovieNotFoundError,
  RepositoryError,
} from "../presentation/components/common/errors/DomainError.js";

// API 호출용 레포지토리
export class OmdbMovieRepository extends MovieRepository {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
  }

  // 목록 검색 구현
  async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(OMDB_BASE_URL, {
        params: {
          apikey: this.apiKey,
          s: query, // 검색 목록 요청
          page: page,
          type: "movie", // 영화만 검색하도록 제한
        },
      });
      const rawData = response.data;
      if (rawData.Response === "False") {
        if (rawData.Error === "Movie not Found") {
          throw new MovieNotFoundError(
            `${query}에 대한 영화 검색 결과를 찾을 수 없습니다.`
          );
        }
        throw new RepositoryError(`OMDb API 오류 : ${rawData.Error}`);
      }

      const movieSummaryList = rawData.Search.map((rawMovie) => ({
        imdbId: rawMovie.imdbID,
        title: rawMovie.Title,
        year: parseInt(rawMovie.Year),
        posterUrl: rawMovie.Poster !== "N/A" ? rawMovie.Poster : null,
      }));

      // 서비스 계층에 필요한 형태로 반환
      return {
        movies: movieSummaryList,
        totalResults: parseInt(rawData.totalResults),
      };
    } catch (error) {
      if (
        error instanceof MovieNotFoundError ||
        error instanceof RepositoryError
      ) {
        throw error;
      }
      throw new RepositoryError(`목록 검색 중 네트워크 오류 발생`, error);
    }
  }

  // ID 기반 상세 조회 구현
  async getMovieById(imdbId) {
    try {
      const response = await axios.get(OMDB_BASE_URL, {
        params: {
          apikey: this.apiKey,
          i: imdbId, // i 파라미터를 사용하여 ID 기반 조회
          r: "json",
          plot: "full",
        },
      });
      const rawData = response.data;

      if (rawData.Response === "False") {
        if (rawData.Error === "Incorrect IMDb ID.") {
          throw new MovieNotFoundError(
            `ID ${imdbId} 에 해당하는 영화를 찾을 수 없습니다.`
          );
        }
        throw new RepositoryError(`OMDb API 오류 : ${rawData.Error}`);
      }

      // Mapping로직
      const movieDetailDto = {
        // 네이밍 컨벤션 통일 (camelCase)
        imdbId: rawData.imdbID,
        title: rawData.Title,
        year: parseInt(rawData.Year),
        posterUrl: rawData.Poster !== "N/A" ? rawData.Poster : null,

        plot: rawData.Plot,
        runtime: rawData.Runtime,
        actors: rawData.Actors,
        director: rawData.Director,
        genre: rawData.Genre,
        country: rawData.Country,
        language: rawData.Language,

        imdbRating: rawData.imdbRating,
        imdbVotes: rawData.imdbVotes,
        metascore: rawData.Metascore,
        rated: rawData.Rated,
        released: rawData.Released,
      };

      return movieDetailDto;
    } catch (error) {
      if (
        error instanceof MovieNotFoundError ||
        error instanceof RepositoryError
      ) {
        throw error;
      }
      throw new RepositoryError(
        `ID ${imdbId} 조회 중 네트워크 오류 발생`,
        error
      );
    }
  }
}
