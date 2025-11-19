import './App.css'
import { OmdbMovieRepository } from './data/OmdbMovieRepository';
import MovieSearchUI from './components/MovieSearchUI';
import { MovieService } from './service/MovieService.js';
import { OMDB_API_KEY } from './config';
import MoviePage from './pages/MoviePage';

// 의존성 컨테이너 주입
const movieRepository = new OmdbMovieRepository(OMDB_API_KEY);
const movieService = new MovieService(movieRepository)

function App() {

  return (
  <div className="App">
    <MoviePage movieService={movieService}/>
  </div>
  );
}

export default App
