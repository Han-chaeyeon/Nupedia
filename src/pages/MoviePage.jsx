import React, { useState } from 'react';
import MovieSearchUI from '../components/MovieSearchUI';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieDetailModal from '../components/MovieDetailModal';
import HomePage from './HomePage';
import SearchResults from '../components/SearchResults';

function MoviePage({ movieService, onMovieSelect }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); //  현재 검색어 저장
    const [currentPage, setCurrentPage] = useState(1);   //  현재 페이지 상태
    const [totalResults, setTotalResults] = useState(0);//  총 결과 수 상태


    // 검색 실행 함수
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

    
    // 상세 정보 조회 로직 (MovieCard 클릭 시)
    const handleCardClick = (imdbId) => {
        if(onMovieSelect) {
            onMovieSelect(imdbId);
        }
    };

    // 페이지 버튼 클릭 시
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchMovies(searchQuery, newPage);
        console.log('new page', newPage);
    };

    // 페이지네이션 UI 추가
    const totalPages = Math.ceil(totalResults / 10);

    return (
        <div style={{ padding: '20px' }}>
            {/* 1. 검색 UI 컴포넌트 */}
            <MovieSearchUI onSearch={handleSearch} />
            {/* 2. 상태 표시 */}
            {loading && <LoadingSpinner />}

            {/* 3. 장르별 섹션 (검색어가 비어있고, 현재 검색 로딩 중이 아닐 때만) */}
            {!searchQuery && !loading && (
                <HomePage movieService={movieService} onMovieSelect={handleCardClick}/>
            )}
            
            {/* 4. 검색 결과 그리드 (searchQuery가 있을 때만) */}
                {searchQuery && (
                    <SearchResults
                        movies={movies}
                        searchQuery={searchQuery}
                        loading={loading}
                        totalResults={totalResults}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                        onMovieSelect={handleCardClick}
                    />
                )}
        </div>
        
    );
}

export default MoviePage;