import React from "react";
import MovieCard from "./MovieCard";
import "../css/MovieGrid.css";

function MovieGrid({ movies, onMovieSelect }) {
  return (
    <div className="movie-grid-section">
      <div className="movie-grid-container">
        {movies.map((movie) => (
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
