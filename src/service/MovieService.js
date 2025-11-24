import { MovieRepository } from "../data/interfaces/MovieRepository";
import {
  MovieNotFoundError,
  InvalidInputError,
  DomainError,
  RepositoryError,
} from "../components/common/errors/DomainError.js";

// 실제 서비스가 의존해야하는 인터페이스
export class MovieService {
  constructor(repository) {
    this.repo = repository;
  }

  // 목록 검색 기능을 제공하는 Facade 메서드
  async searchMovieCollection(query, page = 1) {
    const defaultQuery = "popular";
    const finalQuery = query && query.trim() !== "" ? query : defaultQuery;

    try {
      const result = await this.repo.searchMovies(finalQuery, page);

      return {
        movies: result.movies,
        totalResults: result.totalResults,
      };
    } catch (e) {
      if (e instanceof MovieNotFoundError) {
        return { movies: [], totalResults: 0 };
      }
      if (e instanceof RepositoryError) {
        throw new DomainError(
          `목록 검색 중 외부 시스템 오류 발생`,
          "SearchCollectionError"
        );
      }
      throw new DomainError(
        `목록 검색 중 알 수 없는 오류 발생: ${e.message}`,
        "UncaughtError"
      );
    }
  }

  async getMovieDetailById(imdbId) {
    try {
      const movieDetailDto = await this.repo.getMovieById(imdbId);
      return {
        ...movieDetailDto,
        genres: movieDetailDto.genre ? movieDetailDto.genre.split(", ") : [],
      };
    } catch (e) {
      if (e instanceof MovieNotFoundError || e instanceof InvalidInputError) {
        throw e;
      }
      if (e instanceof RepositoryError) {
        throw new DomainError(
          `ID 기반 조회 중 외부 시스템 오류 발생`,
          "DetailQueryError"
        );
      }
      throw new DomainError(
        `ID 기반 조회 중 알 수 없는 오류 발생: ${e.message}`,
        "UncaughtError"
      );
    }
  }
}
