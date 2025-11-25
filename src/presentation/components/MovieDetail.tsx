import "../css/MovieDetail.css";
import useMovieDetail from "../../hooks/useMovieDetail";
import LoadingSpinner from "./common/LoadingSpinner";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 상세 정보 컴포넌트
const MovieDetail = ({ onGoBack, onSearchTrigger }) => {
  // useMovieDetail 훅을 활용해 상세 정보 업로드
  const {
    selectedMovie: details,
    detailLoading: loading,
    error,
    fetchMovieDetail,
  } = useMovieDetail();
  const [searchTitle, setSearchTitle] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const {imdbId} = useParams(); // app에서 imdbId 불러오기

  // 컴포넌트 마운트, imdbId 변경 시 상세 정보 조회 트리거
  useEffect(() => {
    if (imdbId) {
      fetchMovieDetail(imdbId);
    }
  }, [imdbId, fetchMovieDetail]);

  // 로딩 처리
  if (loading) {
    return (
      <div className="detail-page-container" style={{ textAlign: "center" }}>
        <LoadingSpinner />
        <p style={{ color: "#aaa", marginTop: "10px" }}>상세 정보 로딩 중...</p>
      </div>
    );
  }

  // 에러 처리
  if (error) {
    return (
      <div className="detail-page-container" style={{ color: "red" }}>
        오류: {error}
      </div>
    );
  }

  // 데이터 없음 처리
  if (!details) {
    return (
      <div className="detail-page-container" style={{ color: "#aaa" }}>
        상세 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 10점 만점 평점을 5점 만점(별점)으로 변환하는 함수
  const getStarRating = (rating) => {
    // 10점 만점을 5점 만점으로 변환 (예: 8.8/10 -> 4.4/5)
    const fiveStarRating = (parseFloat(rating) / 2).toFixed(1);
    return fiveStarRating;
  };

  const starRating = getStarRating(details.imdbRating); // 4.4 / 5.0

  const placeholderUrl =
    "https://placehold.co/200x300/444444/FFFFFF?text=No+Poster";

  const genreText = Array.isArray(details.genres)
    ? details.genres.join(" / ")
    : details.genre || "장르 정보 없음";

  // Backdrop URL이 없으면 포스터 URL을 배경 이미지로 사용
  const backgroundImageUrl =
    details.backdropUrl || details.posterUrl || placeholderUrl;

  // 포스터 다운로드 핸들러 함수
  const handleDownloadPoster = async () => {
    const url = details.posterUrl; // 외부 이미지 URL
    // 이미지 없음 처리 로직 (생략 가능, 안전장치)
    if (!url || url === placeholderUrl) {
      console.error("다운로드할 포스터 이미지가 없습니다.");
      return;
    }

    setIsDownloading(true); // 다운로드 시작 알림

    try {
      // 1. fetch API를 사용하여 외부 이미지 파일을 Blob 형태로 가져옴
      // { mode: 'cors' }는 교차 출처 요청을 허용
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const imageBlob = await response.blob();

      // 2. Blob 데이터를 기반으로 임시 URL을 생성
      // 이 URL은 현재 앱의 메모리 공간을 가리키므로 '동일 출처(Same-Origin)'처럼 작동
      const objectURL = URL.createObjectURL(imageBlob);

      // 3. 임시 링크를 생성하고 download 속성을 적용하여 클릭
      const link = document.createElement("a");
      link.href = objectURL;
      link.download = `${details.title.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_Poster.jpg`;
      document.body.appendChild(link);
      link.click(); // 다운로드 트리거

      // 4. 사용 후 임시 URL과 링크 요소를 정리(메모리 누수 방지)
      document.body.removeChild(link);
      URL.revokeObjectURL(objectURL);
    } catch (e) {
      console.error("다운로드 중 오류가 발생했습니다:", e.message);
      // 오류 알림 로직
      alert(
        "포스터 다운로드에 실패했습니다. (네트워크 또는 서버 문제일 수 있습니다.)"
      );
    } finally {
      setIsDownloading(false); // 다운로드 완료/실패 알림
    }
  };

  // 검색 키워드 전달
  const handleDetailSearch = (e) => {
    e.preventDefault();
    const query = searchTitle.trim();

    if (query && onSearchTrigger) {
      // 부모 컴포넌트에게 검색어(query) 전달
      onSearchTrigger(query);
      setSearchTitle("");
    }
  };

  return (
    <div className="detail-page-container">
      <nav className="detail-navbar">
        <button className="nav-button back-button" onClick={onGoBack}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
          홈으로
        </button>
        <form
          className="detail-search-inline-form"
          onSubmit={handleDetailSearch}
        >
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="영화 제목 검색..."
            className="detail-search-inline-input"
          />
          <button type="submit" className="nav-button search-submit-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderUrl;
              }}
            />
          </div>
          <div className="detail-info-area">
            {/* 타이틀 및 서브 정보 */}
            <div className="detail-title-group">
              <h1 className="detail-title">{details.title}</h1>
              <div className="detail-action-bar top-position"></div>
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
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  포스터 다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 평점 섹션 */}
        <div className="detail-overlay-container">
          <div className="overlay-rating-box imdb-box">
            <span className="rating-source">IMDb</span>
            <div className="star-rating-container">
              {/* 5점 만점 기준 백분율 계산 (예: 4.4 / 5.0 * 100 = 88%) */}
              <div
                className="stars-filled"
                style={{ width: `${(starRating / 5) * 100}%` }}
              >
                ★★★★★
              </div>
              <div className="stars-empty">★★★★★</div>
            </div>
            {/* 평점 텍스트 (4.4 / 5.0 형식으로 표시) */}
            <span className="rating-text">{starRating} / 5.0</span>
          </div>
          {details.metascore && details.metascore !== "N/A" && (
            <div className="overlay-rating-box metascore-box">
              <span className="rating-source">Metascore</span>
              <span className="rating-value-display">{details.metascore}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. 바디 섹션: 평점 -> 줄거리 -> 인물/정보 순서 */}
      <div className="detail-body-wrapper">
        {/* 줄거리 섹션 */}
        <section className="detail-section plot-section">
          <h2 className="section-title">줄거리</h2>
          <p className="section-content">{details.plot}</p>
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
};

export default MovieDetail;
