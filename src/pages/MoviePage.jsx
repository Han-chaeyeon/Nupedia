import React, { useState } from 'react';
import MovieSearchUI from '../components/MovieSearchUI';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

function MoviePage({ movieService }) {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null); // 모달에 표시할 상세 영화 정보
    const [searchQuery, setSearchQuery] = useState(''); // ⭐️ 현재 검색어 저장
    const [currentPage, setCurrentPage] = useState(1);   // ⭐️ 현재 페이지 상태
    const [totalResults, setTotalResults] = useState(0);// ⭐️ 총 결과 수 상태
    const fetchMovies = async (query, page) => {
        setLoading(true);
        setError(null);
        
        try {
            const { movies, totalResults, error } = await movieService.searchMovieCollection(query, page);
            
            if (error) {
                setError(error);
                setMovies([]);
                setTotalResults(0);
            } else {
                setMovies(movies);
                setTotalResults(totalResults ? parseInt(totalResults) : 0);
            }
        } catch (e) {
            setError('영화 검색 중 알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };
    
    // 검색어 입력 시 (항상 1페이지부터 시작)
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchMovies(query, 1);
    };

    
    // ⭐️ 상세 정보 조회 로직 (MovieCard 클릭 시)
    const handleCardClick = async (imdbId) => {
        setLoading(true);
        setError(null);
        
        // Service 계층의 상세 정보 조회 메서드 호출 (아직 구현되지 않았음)
        const result = await movieService.getMovieDetailById(imdbId);
        
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSelectedMovie(result); // 상세 정보 모달을 띄우기 위한 데이터 저장
        }
    };

    // ⭐️ 페이지 버튼 클릭 시
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchMovies(searchQuery, newPage);
    };

    // ⭐️ 페이지네이션 UI 추가
    const totalPages = Math.ceil(totalResults / 10);

    return (
        <div style={{ padding: '20px' }}>
            {/* 1. 검색 UI 컴포넌트 */}
            {/* onSearch prop에 Page의 검색 핸들러 함수를 전달 */}
            <MovieSearchUI onSearch={handleSearch} />

            {/* 2. 상태 표시 */}
            {loading && <LoadingSpinner />}

            {error && ( // ⭐️ 오류 발생 시 표시
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    🚫 오류 발생: {error}
                </div>
            )}
            
                
            {/* 3. 영화 그리드 컴포넌트 */}
            {!loading && movies.length > 0 && (
                <MovieGrid 
                    movies={movies} 
                    onMovieSelect={handleCardClick} // 카드 클릭 이벤트 핸들러 전달
                />
            )}
            
            {/* 4. 상세 정보 모달 (선택된 영화가 있을 때만 표시) */}
            {selectedMovie && (
                <MovieDetailModal 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                />
                
            )}

            
            {/* 5. 페이지네이션 */}
            {totalPages > 1 && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                <span style={{ margin: '0 15px' }}>
                    페이지 {currentPage} / {totalPages}
                </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage >= totalPages}
                >
                    다음
                </button>
            </div>
        )}
        </div>
        
    );
}

export default MoviePage;