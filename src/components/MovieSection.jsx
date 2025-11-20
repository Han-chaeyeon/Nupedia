// src/components/MovieSection.jsx

import { useEffect, useRef, useState } from 'react';
import '../css/MovieSection.css';
import MovieCard from './MovieCard'; // 기존에 만든 카드 컴포넌트를 사용

const MovieSection = ({ title, query, movieService, onMovieSelect }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchSectionMovies = async () => {
            setLoading(true);
            try {
                // MovieService를 사용하여 해당 쿼리로 1페이지 영화 검색
                const { movies: fetchedMovies } = await movieService.searchMovieCollection(query, 1);
                setMovies(fetchedMovies);
            } catch (error) {
                console.error(`Error loading section ${title}:`, error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSectionMovies();
    }, [query, movieService]); // query가 변경될 때마다 재호출

    // 스크롤 버튼
    const scrollByAmount = (direction) => {
    if (scrollRef.current) {
        const container = scrollRef.current;
        const cardElement = container.querySelector('.scroll-item');

        // 카드 하나의 너비 + 마진(12px)을 계산하여 이동량 결정
        let scrollAmount = cardElement ? cardElement.offsetWidth + 20 : container.clientWidth * 0.8;

        // 5칸씩 이동하도록 설정
        container.scrollBy({
            left: direction * scrollAmount * 5, 
            behavior: 'smooth' // 부드러운 스크롤 애니메이션 적용
        });
    }
};

    if (loading) {
        return <h3 style={{ color: '#aaa', paddingLeft: '20px' }}>{title} 로딩 중...</h3>;
    }

    if (movies.length === 0) {
        return <div style={{ color: '#aaa', paddingLeft: '20px' }}>{title} 목록을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="movie-section-container">
            <h2 className="section-title">{title}</h2>
            {/* 좌우 스크롤을 위한 컨테이너 */}
            <div className="scroll-wrapper" >
                <button className="scroll-button left-button" onClick={() => scrollByAmount(-1)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                    <div className="movie-list-scroll" ref={scrollRef}>
                        {movies.map(movie => (
                                <MovieCard key={movie.imdbId} movie={movie} onMovieSelect={onMovieSelect} />
                        ))}
                    </div>
                <button className="scroll-button right-button" onClick={() => scrollByAmount(1)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
        </div>
        </div>
    );
};

export default MovieSection;