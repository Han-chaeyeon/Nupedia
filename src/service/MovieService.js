import { MovieRepository } from "../data/interfaces/MovieRepository";

// 실제 서비스가 의존해야하는 인터페이스
export class MovieService {
    constructor(MovieRepository) {
        this.repo = MovieRepository;
    }

    // UI 계층에 검색 기능 제공하는 facade 패턴 적용
    async searchMoiveDetail(title) {
        console.log(`비즈니스 로직 처리 시작`);

        if(!title || title.trim() === '') {
            return {error: "검색하고 싶은 영화 제목을 입력해 주세요."};
        }    

        const rawData = await this.repo.getMovieBytitle(title);

        if(rawData.Response === "False") {
            return {error: "알 수 없는 오류가 발생하였습니다."}
        }
        
        return {
            title: rawData.title,
            year: rawData.Year,
            director: rawData.Director,
            rating: rawData.imdbRating,
            posterUrl: rawData.Poster !== 'N/A' ? rawData.Poster : null,
            plot: rawData.Plot
        };
    }

    // 목록 검색 기능을 제공하는 Facade 메서드
    async searchMovieCollection(query, page=1) {
        const defaultQuery = 'popular';
        const finalQuery = query && query.trim() !== '' ? query : defaultQuery;

        const rawData = await this.repo.searchMovies(finalQuery, page);
        
        if (rawData.Response === "False") {
            return { error: rawData.Error, movies: [] };
        }

        // UI에 필요한 최소 정보만 포함하도록 배열을 가공
        const processedMovies = rawData.Search.map(movie => ({
            imdbId: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            posterUrl: movie.Poster !== 'N/A' ? movie.Poster : null,
        }));
        
        return {
            movies: processedMovies,
            totalResults: rawData.totalResults
        };
    }

    async getMovieDetailById(imdbId) {
        console.log(`[Service] ID 기반 상세 조회 시작: ${imdbId}`);
        
        const rawResponse = await this.repo.getMovieById(imdbId);
        
        if (rawResponse.Response === "False") {
            return { error: rawResponse.Error || "상세 정보를 찾을 수 없습니다." };
        }

        const movieData = rawResponse.movie;

        // 상세 정보에 장르가 포함되어 있으므로 UI에 맞게 가공
        return {
            id: movieData.imdbId,
            title: movieData.title,
            year: movieData.year,
            director: movieData.director,
            rating: movieData.imdbRating,
            posterUrl: movieData.posterUrl,
            plot: movieData.plot,
            genres: movieData.genre ? movieData.genre.split(', ') : [], // 쉼표로 구분된 장르를 배열로 변환
            language: movieData.language,

            runtime: movieData.runtime,
            actors: movieData.actors,
            country: movieData.country,
            metascore: movieData.metascore,
            imdbRating:movieData.imdbRating,
            rated: movieData.rated,
            released: movieData.released,
        };
    }
}