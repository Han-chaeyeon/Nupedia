import React from 'react';

function MovieDetailModal({ movie, onClose }) {
    if (!movie) return null;

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '700px',
        maxHeight: '90%',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={{ float: 'right', border: 'none', background: 'none', fontSize: '1.5em', cursor: 'pointer' }}>
                    &times;
                </button>
                <h2>{movie.title} ({movie.year})</h2>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    {movie.posterUrl && (
                        <img src={movie.posterUrl} alt={`${movie.title} 포스터`} style={{ width: '200px', height: 'auto', objectFit: 'cover' }} />
                    )}
                    <div>
                        <p><strong>평점:</strong> ⭐ {movie.rating} / 10</p>
                        <p><strong>장르:</strong> {movie.genres ? movie.genres.join(', ') : 'N/A'}</p>
                        <p><strong>감독:</strong> {movie.director}</p>
                        <p><strong>줄거리:</strong> {movie.plot}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetailModal;