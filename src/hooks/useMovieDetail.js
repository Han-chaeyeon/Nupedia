import { useState, useCallback } from 'react';

/**
 * 영화 상세 정보를 로드하고 상태를 관리하는 커스텀 훅
 * @param {object} movieService - 영화 API 서비스 인스턴스
 * @returns {object} { selectedMovie, detailLoading, error, fetchMovieDetail, clearDetail }
 */
const useMovieDetail = (movieService) => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState(null);

    // 상세 정보 조회 함수
    const fetchMovieDetail = useCallback(async (imdbId) => {
        if (!imdbId) return;

        setDetailLoading(true);
        setError(null);
        
        try {
            // Service 계층의 상세 정보 조회 메서드 호출
            const result = await movieService.getMovieDetailById(imdbId);
            
            if (result.error) {
                setError(result.error);
                setSelectedMovie(null);
            } else {
                setSelectedMovie(result); // 상세 정보 모달을 띄우기 위한 데이터 저장
            }
        } catch (e) {
            setError('상세 정보 조회 중 알 수 없는 오류가 발생했습니다.');
            setSelectedMovie(null);
        } finally {
            setDetailLoading(false);
        }
    }, [movieService]);

    // 상세 정보 상태 초기화 (모달 닫기용)
    const clearDetail = useCallback(() => {
        setSelectedMovie(null);
        setError(null);
    }, []);

    return { 
        selectedMovie, 
        detailLoading, 
        error, 
        fetchMovieDetail, 
        clearDetail 
    };
};

export default useMovieDetail;