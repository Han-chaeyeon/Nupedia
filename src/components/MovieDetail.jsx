import '../css/MovieDetail.css'
import useMovieDetail from '../hooks/useMovieDetail';
import LoadingSpinner from './common/LoadingSpinner';
import React, { useEffect, useState } from 'react';

// 상세 정보 컴포넌트
const MovieDetail = ({imdbId, movieService, onGoBack, onSearchTrigger}) => {
    // useMovieDetail 훅을 활용해 상세 정보 업로드
    const {
        selectedMovie: details,
        detailLoading:loading,
        error,
        fetchMovieDetail
    } = useMovieDetail(movieService);
    const [searchTitle, setSearchTitle] = useState('');
    // 컴포넌트 마운트, imdbId 변경 시 상세 정보 조회 트리거
    useEffect(() => {
        if(imdbId) {
            fetchMovieDetail(imdbId)
        }
    }, [imdbId, fetchMovieDetail])

    // 로딩 처리
    if (loading) {
        return (
            <div className="detail-page-container" style={{ textAlign: 'center' }}>
                <LoadingSpinner />
                <p style={{ color: '#aaa', marginTop: '10px' }}>상세 정보 로딩 중...</p>
            </div>
        );
    }
    
    // 에러 처리
    if (error) {
         return <div className="detail-page-container" style={{ color: 'red' }}>오류: {error}</div>;
    }
    
    // 데이터 없음 처리
    if (!details) {
         return <div className="detail-page-container" style={{ color: '#aaa' }}>상세 정보를 찾을 수 없습니다.</div>;
    }

    const placeholderUrl = 'https://placehold.co/200x300/444444/FFFFFF?text=No+Poster';
    
    const genreText = Array.isArray(details.genres) 
                        ? details.genres.join(' / ') 
                        : (details.genre || '장르 정보 없음');
    
    // Backdrop URL이 없으면 포스터 URL을 배경 이미지로 사용
    const backgroundImageUrl = details.backdropUrl || details.posterUrl || placeholderUrl;

    // 포스터 다운로드 핸들러 함수
    const handleDownloadPoster = () => {
        const url = details.posterUrl;
        if (!url || url === placeholderUrl) {
            console.error("다운로드할 포스터 이미지가 없습니다.");
            return;
        }

        const link = document.createElement('a');
        link.href = url;
        link.download = `${details.title.replace(/[^a-zA-Z0-9]/g, '_')}_Poster.jpg`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 검색 키워드 전달
    const handleDetailSearch = (e) => {
        e.preventDefault();
        const query = searchTitle.trim();
        
        if (query && onSearchTrigger) {
            // 부모 컴포넌트에게 검색어(query) 전달
            onSearchTrigger(query); 
            setSearchTitle('');
        }
    };


    return (
        <div className="detail-page-container">
            <nav className="detail-navbar">
                <button 
                    className="nav-button back-button" 
                    onClick={onGoBack} 
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                    </svg>
                    홈으로
                </button>
                <form className="detail-search-inline-form" onSubmit={handleDetailSearch}>
                    <input 
                        type="text" 
                        value={searchTitle} 
                        onChange={(e) => setSearchTitle(e.target.value)}
                        placeholder="영화 제목 검색..." 
                        className="detail-search-inline-input"
                    />
                    <button type="submit" className="nav-button search-submit-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </button>
                </form>
            </nav>
            {/* 1. 히어로 섹션 (배경 이미지 + 주요 정보) */}
            <div 
                className="detail-hero" 
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                {/* 정보를 담는 내부 컨테이너 */}
                <div className="detail-content-wrapper">
                    <div className="detail-poster-wrapper">
                        <img 
                            src={details.posterUrl || placeholderUrl} 
                            alt={`${details.title} 포스터`}
                            className="detail-poster"
                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderUrl; }}
                        />
                    </div>
                    
                    <div className="detail-info-area">
                        {/* 타이틀 및 서브 정보 */}
                        <div className="detail-title-group">
                            <h1 className="detail-title">
                                {details.title}
                            </h1>
                            
                            <div className="detail-action-bar top-position">
                            </div>
                            {/* 메타데이터 (연도, 러닝타임, 국가) */}
                            <p className="detail-subtitle">
                                {details.year} · {genreText}
                            </p>
                            <p className="detail-subtitle detail-sub-item">
                                {details.runtime} · {details.rated}
                            </p>
                            <p className="detail-subtitle detail-sub-item">
                                {details.country}
                            </p>
                            <div className="action-button-group">
                                    <button 
                                        className="action-button download-button" 
                                        onClick={handleDownloadPoster}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                        </svg>
                                        포스터 다운로드
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 바디 섹션: 평점 -> 줄거리 -> 인물/정보 순서 */}
            <div className="detail-body-wrapper">
                {/* 줄거리 섹션 */}
                <section className="detail-section plot-section">
                    <h2 className="section-title">줄거리</h2>
                    <p className="section-content">{details.plot}</p>
                </section>

                <section className="detail-section ratings-section-summary">
                    <h2 className="section-title">통합 평점</h2>
                    <div className="ratings-grid summary-grid">
                        <div className="rating-item summary-item">
                            <span className="rating-source">IMDb</span>
                            <span className="rating-value-display">{details.imdbRating} / 10</span>
                        </div>
                        {(details.metascore && details.metascore !== 'N/A') && (
                            <div className="rating-item summary-item metascore-item">
                                <span className="rating-source">Metascore</span>
                                <span className="rating-value-display">{details.metascore}</span>
                            </div>
                        )}
                    </div>
                </section>
                {/* 주요 인물 및 정보 섹션 */}
                <section className="detail-section staff-section">
                    <h2 className="section-title">주요 인물 및 정보</h2>
                    <div className="staff-grid">
                        <div className="staff-item">
                            <span className="staff-role">감독</span>
                            <span className="staff-name">{details.director}</span>
                        </div>
                        <div className="staff-item">
                            <span className="staff-role">배우</span>
                            <span className="staff-name">{details.actors}</span>
                        </div>
                        <div className="staff-item">
                            <span className="staff-role">개봉일</span>
                            <span className="staff-name">{details.released}</span>
                        </div>
                        <div className="staff-item">
                            <span className="staff-role">언어</span>
                            <span className="staff-name">{details.language}</span>
                        </div>
                    </div>
                </section>
            </div>
            
        </div>
    );
}

export default MovieDetail;