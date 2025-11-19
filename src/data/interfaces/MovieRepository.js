// 영화 데이터 접근을 위한 레포지토리
export class MovieRepository {
    async getMovieBytitle(title) {
        throw new Error("Method 'getMovieTitle' must be implemented.");
    }

    async searchMovies(query) {
        throw new Error("Method 'searchMoives must be implemented");
    }

    // ⭐️ 기존: 단일 영화 상세 정보 (제목 기반)
    async getMovieByTitle(title) {
        throw new Error("Method 'getMovieByTitle()' must be implemented.");
    }
    
    // ⭐️ 추가: ID 기반 상세 조회
    async getMovieById(imdbId) {
        throw new Error("Method 'getMovieById()' must be implemented.");
    }
    
    // ⭐️ 추가: 여러 영화 목록 검색
    async searchMovies(query, page) {
        throw new Error("Method 'searchMovies()' must be implemented.");
    }
}