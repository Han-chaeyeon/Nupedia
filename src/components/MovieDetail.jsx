import '../css/MovieDetail.css'
import useMovieDetail from '../hooks/useMovieDetail';
import LoadingSpinner from './common/LoadingSpinner';
import React, { useEffect } from 'react';

// 상세 정보 컴포넌트
const MovieDetail = ({imdbId, movieService}) => {
    // useMovieDetail 훅을 활용해 상세 정보 업로드
    const {
        selectedMovie: details,
        detailLoding:loading,
        error,
        fetchMovieDetail
    } = useMovieDetail(movieService);

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

    const placeholderUrl = 'https://placehold.co/300x450/444444/FFFFFF?text=No+Poster';

    return (
        <div className="detail-page-container">
            
            {/* 뒤로가기 버튼: window.history.back()을 사용해 브라우저의 이전 기록으로 돌아갑니다. */}
            <button 
                onClick={() => window.history.back()}
                className="detail-back-button" // ⭐️ CSS 클래스 적용
            >
                &larr; 돌아가기
            </button>
            
            <div className="detail-content-wrapper"> {/* ⭐️ CSS 클래스 적용 */}
                
                {/* 포스터 */}
                <img 
                    src={details.posterUrl || placeholderUrl} 
                    alt={`${details.title} 포스터`}
                    className="detail-poster" // ⭐️ CSS 클래스 적용
                />
                
                {/* 정보 영역 */}
                <div className="detail-info-area"> {/* ⭐️ CSS 클래스 적용 */}
                    
                    {/* 타이틀 */}
                    <h1 className="detail-title"> {/* ⭐️ CSS 클래스 적용 */}
                        {details.title}
                    </h1>
                    
                    {/* 서브타이틀 */}
                    <p className="detail-subtitle"> {/* ⭐️ CSS 클래스 적용 */}
                        {details.year} · {details.runtime} · {details.genre}
                    </p>
                    
                    {/* 레이팅 섹션 */}
                    <div className="detail-rating-divider"> {/* ⭐️ CSS 클래스 적용 */}
                        <p className="detail-rating-star"> {/* ⭐️ CSS 클래스 적용 */}
                            ⭐️ **IMDB Rating:** {details.imdbRating} / 10 ({details.imdbVotes} Votes)
                        </p>
                        <p className="detail-rating-meta"> {/* ⭐️ CSS 클래스 적용 */}
                            🏅 **Metascore:** {details.metascore}
                        </p>
                    </div>
                    
                    <p>**Plot:** {details.plot}</p>
                    <p>**Director:** {details.director}</p>
                    <p>**Actors:** {details.actors}</p>
                    <p>**Country:** {details.country}</p>
                    <p>**Language:** {details.language}</p>
                </div>
            </div>
            
        </div>
    );
}

export default MovieDetail;