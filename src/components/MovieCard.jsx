import React from 'react';

// 영화 객체와 클릭 핸들러를 props로 받습니다.
function MovieCard({ movie, onSelect }) {
    
    // 포스터 이미지가 없는 경우 표시할 대체 이미지 URL
    const placeholderUrl = 'https://via.placeholder.com/300x450?text=No+Poster';

    // 카드 클릭 시, 부모 컴포넌트에 영화 ID를 전달합니다.
    const handleClick = () => {
        if (onSelect) {
            onSelect(movie.imdbId);
        }
    };

    return (
        <div 
            onClick={handleClick}
            style={{ 
                cursor: 'pointer', 
                textAlign: 'center', 
                width: '180px', 
                margin: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
            <img 
                src={movie.posterUrl || placeholderUrl} 
                alt={`${movie.title} 포스터`}
                style={{ 
                    width: '100%', 
                    height: '270px', // 포스터 비율 유지
                    objectFit: 'cover' 
                }}
            />
            <div style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                    {movie.year}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;