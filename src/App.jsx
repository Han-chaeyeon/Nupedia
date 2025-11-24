import './App.css'
import { OmdbMovieRepository } from './data/OmdbMovieRepository';
import MovieSearchUI from './components/MovieSearchUI';
import { MovieService } from './service/MovieService.js';
import { OMDB_API_KEY } from './config';
import MoviePage from './pages/MoviePage';
import MovieDetail from './components/MovieDetail'
import { useEffect, useState } from 'react';

// 의존성 컨테이너 주입
const movieRepository = new OmdbMovieRepository(OMDB_API_KEY);
const movieService = new MovieService(movieRepository);

function App() {
  // URL 추적
  const [path, setPath] = useState(window.location.hash);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const isDetailView = path.startsWith('#/detail/');

  // 라우팅 핸들러
  const handleMovieSelect = (imdbId) => {
    window.location.hash = `#/detail/${imdbId}`;
  }

  const handleGlobalSearch = (query) => {
    setCurrentSearchQuery(query); // 상태 저장
    window.location.hash = '#/'; 
  }


  // 홈으로 돌아가기
  const handleGoBack = () => {
    window.location.hash = '#/'; 
  }

  // 해시 변경 이벤트 리스너
  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash || '#/'); 
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange); 
  }, []);


  // 현재 경로에 따라 렌더링할 페이지 결정
  const renderPage = () => {
    if(path.startsWith('#/detail/')) {
      const id = path.split('/').pop().split('?')[0];
      return <MovieDetail imdbId={id} movieService={movieService} onGoBack={handleGoBack} onSearchTrigger={handleGlobalSearch}/>;
    }

    // 기본경로, 다른 경로는 moviePage 렌더링
    return <MoviePage movieService={movieService} onMovieSelect={handleMovieSelect} initialSearchQuery={currentSearchQuery}/>
  }
  


  return (
 <div className="App">
      {!isDetailView && (
        <MovieSearchUI onSearch={handleGlobalSearch}
        initialQuery={currentSearchQuery}
        />
      )}

      <div className='content-container'>
        {renderPage()}
      </div>
    </div>
  );
}

export default App
