// src/components/SearchResults.jsx
import React from 'react';
import MovieGrid from './MovieGrid'; // 영화 목록을 표시하는 컴포넌트

/**
 * 영화 검색 결과 목록과 페이지네이션 UI 렌더링
 */
const SearchResults = ({ 
    movies, 
    searchQuery, 
    loading, 
    totalResults,
    currentPage,
    totalPages,
    handlePageChange,
    onMovieSelect 
}) => {
    // 1. 결과가 있고, 검색은 완료되었을 때 (검색 결과 및 페이지네이션)
    if (searchQuery && !loading && movies.length > 0) {
        return (
            <>
                {/* 검색 결과 건수 표시 */}
                <h2 style={{ color: '#f5f5f5', margin: '30px 0 10px 0' }}>
                    '{searchQuery}' 검색 결과 ({totalResults}건)
                </h2>
                <MovieGrid 
                    movies={movies} 
                    onMovieSelect={onMovieSelect}
                />
                
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            style={{ padding: '8px 16px', margin: '0 5px', borderRadius: '5px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            이전
                        </button>
                        <span style={{ margin: '0 15px', color: '#fff' }}>
                            페이지 {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage >= totalPages}
                            style={{ padding: '8px 16px', margin: '0 5px', borderRadius: '5px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            다음
                        </button>
                    </div>
                )}
            </>
        );
    }
    
    // 2. 결과가 없고, 검색은 완료되었을 때 (결과 없음 메시지)
    if (searchQuery && !loading && movies.length === 0) {
         return (
             <div style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
                 <p>'{searchQuery}'에 대한 검색 결과가 없습니다.</p>
             </div>
         );
    }

    return null; // 검색어가 없거나 로딩 중일 때는 아무것도 렌더링하지 않습니다.
};

export default SearchResults;