import React from 'react';
import MovieCard from './MovieCard';

// 영화 배열과 선택 핸들러를 MoviePage로부터 받습니다.
function MovieGrid({ movies, onMovieSelect }) {
    
    return (
        <div style={{ padding: '20px 0' }}>
            <h2>🎬 검색 결과</h2>
            <div 
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // 화면 크기에 따라 자동으로 줄 바꿈
                    justifyContent: 'center', // 중앙 정렬
                    gap: '20px'
                }}
            >
                {movies.map(movie => (
                    <MovieCard 
                        key={movie.imdbId} 
                        movie={movie} 
                        onMovieSelect={onMovieSelect} // MovieCard 클릭 이벤트를 부모(MoviePage)로 전달
                    />
                ))}
            </div>
        </div>
    );
}

export default MovieGrid;