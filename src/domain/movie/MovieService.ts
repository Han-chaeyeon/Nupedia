/**
 * MovieService.ts
 * 실질적인 비즈니스 로직 처리
 * - searchMovieCollection: 목록 검색 기능 제공하는 service
 * - getMovieDetailById: movieId 사용해서 상세정보 추출
 */

import {
  MovieNotFoundError,
  InvalidInputError,
  DomainError,
  RepositoryError,
} from "../../common/errors/DomainError.js";
import { IMovieRepository } from "./IMovieRepository.js";
import { IMovieService } from "./ImovieService.js";
import { MovieDetailDTO } from "../../models/MovieDetailDTO.js";
import { MovieSearchResultDTO, MovieSummaryDTO } from "../../models/MovieSummaryDTO.js";
import { MovieDetailView } from "../../models/MovieDetailView.js";



export class MovieService implements IMovieService {

  private repo: IMovieRepository;

  constructor(repository: IMovieRepository) {
    this.repo = repository;
  }

  // 목록 검색 기능을 제공하는 Facade 메서드
  public async searchMovieCollection(query: string | null, page: number = 1): Promise<MovieSearchResultDTO> {
    const defaultQuery = "popular";
    const finalQuery = query && query.trim() !== "" ? query : defaultQuery;

    try {
      const result:MovieSearchResultDTO = await this.repo.searchMovies(finalQuery, page);

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
        `목록 검색 중 알 수 없는 오류 발생: ${(e as Error).message}`,
        "UncaughtError"
      );
    }
  }

  async getMovieDetailById(movieId: string): Promise<MovieDetailView> {
    try {
      const movieDetailDto = await this.repo.getMovieById(movieId);
      return {
        ...movieDetailDto,
        genres: this._splitStringToArray(movieDetailDto.genre),
        actors: this._splitStringToArray(movieDetailDto.actors),
        imdbVotesFormatted: this._formatVoteCount(movieDetailDto.imdbVotes),
        runTimeFormatted: this._formatRuntime(movieDetailDto.runtime),
        boxOfficeFormatted: this._formatBoxOffice(movieDetailDto.boxOffice),
        releasedFormatted: this._formatReleased(movieDetailDto.released),
      } as MovieDetailView;
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
        `ID 기반 조회 중 알 수 없는 오류 발생: ${(e as Error).message}`,
        "UncaughtError"
      );
    }
  }

  // , 기준으로 문자 쪼개서 배열로 반환(장르, 배우)
  private _splitStringToArray(data: string|null): string[] {
    if(!data || data === 'N/A') return [];
    return data.split(', ').filter(s => s.trim() !== '');
  }

  // number -> string으로 포맷팅(UI 출력용)
  private _formatVoteCount(votes: number | null): string|null {
    if(!votes || votes === 0) return null;

    const value = Math.abs(votes);
    
    // 단위 정의 (천, 백만)
    const units = [
        { value: 1e6, symbol: "M" }, // 백만 (Million)
        { value: 1e3, symbol: "K" }, // 천 (Thousand)
    ];

    for (let i = 0; i < units.length; i++) {
        if (value >= units[i].value) {
            
            // 값을 단위로 나누고, 소수점 첫째 자리까지 표시
            const formatted = (value / units[i].value).toFixed(1); 
            
            // 소수점 이하가 .0 일 경우 제거 (예: 1.0M -> 1M)
            const cleanFormatted = formatted.replace(/\.0$/, ''); 
            
            return cleanFormatted + units[i].symbol;
        }
    }

    // 1,000 미만 단위 처리 (기본 쉼표 포맷)
    // 1K 미만인 경우는 쉼표만 붙여서 반환
    return votes.toLocaleString("en-US");
  }

  // 러닝타임 문자열로 포맷팅(h시 n분 등)
  private _formatRuntime(data: string|null): string | null {
    if(!data || data === "N/A") return null;
    const match = data.match(/\d+/);

    if(!match || !match[0]) return null;

    const totalMinute = parseInt(match[0], 10);
    if(isNaN(totalMinute) || totalMinute < 0) return null;

    const hours = Math.floor(totalMinute / 60);
    const minutes = totalMinute % 60;

    let formattedRuntime = '';

    if(hours > 0) {
      formattedRuntime += `${hours} 시간`;
    }

    if(minutes > 0 || hours === 0) {
      if(hours === 0 || minutes > 0) {
        formattedRuntime += `${minutes}분`;
      }
    }

    if(formattedRuntime.trim() === '') {
      return null;
    }

    return formattedRuntime.trim();
  }

  // Boxoffice 포맷팅
  private _formatBoxOffice(data: string | null | undefined): string | null {
    if(!data || data === 'N/A') return null;

    const cleanedValue = data.replace(/[$,\s]/g, '');
    const parsedValue = parseInt(cleanedValue, 10);

    if(isNaN(parsedValue)) return null;

    return parsedValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 0
    })
  }

  private _formatReleased(data: string|null): string|null {
    if(!data || data === 'N/A') return null;

    const dateObject = new Date(data);

    if (isNaN(dateObject.getTime())) {
        return null; 
    }

    return dateObject.toLocaleDateString('ko-KR', {
        year: 'numeric',   // 4자리 연도 (예: 2005)
        month: '2-digit',  // 2자리 월 (예: 12)
        day: '2-digit'     // 2자리 일 (예: 25)
    })
  }
}
