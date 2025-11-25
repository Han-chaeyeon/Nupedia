import "./App.css";
import { OmdbMovieRepository } from "./data/OmdbMovieRepository";
import MovieSearchUI from "./components/MovieSearchUI";
import { MovieService } from "./service/MovieService.js";
import { OMDB_API_KEY } from "./config";
import MoviePage from "./pages/MoviePage";
import MovieDetail from "./components/MovieDetail";
import { useEffect, useState } from "react";
import { MovieServiceProvider } from "./service/MovieServiceContext.jsx";
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

// 의존성 컨테이너 주입
const movieRepository = new OmdbMovieRepository(OMDB_API_KEY);
const movieService = new MovieService(movieRepository);

function App() {
  // URL 추적
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailView = location.pathname.startsWith("/detail/")

  // 라우팅 핸들러
  const handleMovieSelect = (imdbId) => {
    navigate(`/detail/${imdbId}`);
  };

  // 검색 트리거
  const handleGlobalSearch = (query) => {
    setCurrentSearchQuery(query); // 상태 저장
    navigate('/');
  };

  // 홈으로 돌아가기
  const handleGoBack = () => {
    setCurrentSearchQuery("");
    navigate("/", {replace:true})
  };

  return (
    <MovieServiceProvider service={movieService}>
      <div className="App">
        {!isDetailView && (
          <MovieSearchUI
            onSearch={handleGlobalSearch}
            initialQuery={currentSearchQuery}
          />
          
        )}
        <div className="content-container">
          <Routes>
              {/* Home View: / 경로에 MoviePage 렌더링 */}
            <Route 
              path="/" 
              element={<MoviePage onMovieSelect={handleMovieSelect} initialSearchQuery={currentSearchQuery} onClearSearch={handleGoBack} />} 
            />

            {/* Detail View: /detail/ 다음에 오는 값을 imdbId 파라미터로 정의 */}
            <Route 
              path="/detail/:imdbId" 
              element={<MovieDetail onGoBack={handleGoBack} />} 
            />
          </Routes>
        </div>
      </div>
    </MovieServiceProvider>
  );
}

const Root = () => {
  return (
  <HashRouter>
    <App/>
  </HashRouter>
  )
}

export default Root;
