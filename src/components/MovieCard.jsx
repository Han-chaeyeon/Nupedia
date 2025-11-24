import React from 'react';
import '../css/MovieCard.css';

function MovieCard({ movie, onMovieSelect }) {
    
    // 포스터 이미지가 없는 경우 표시할 대체 이미지 URL
   const placeholderUrl = 'https://placehold.co/300x450/555/fff?text=No+Poster'

    const handleClick = () => {
        if (onMovieSelect) {
            onMovieSelect(movie.imdbId);
        }
    };

    return (
        <div onClick={handleClick} className="movie-card scroll-item movie-card-content">
          <img 
                src={movie.posterUrl || placeholderUrl} 
                alt={`${movie.title} 포스터`}
                className='poster-image'
                onError={(e) => {
                    e.target.onerror = null; 
                    
                    e.target.src = placeholderUrl;
                }}
            />
            <div className="card-text-area">
                <h4 className="card-title">
                    {movie.title}
                </h4>
                <p className="card-year">
                    {movie.year}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;