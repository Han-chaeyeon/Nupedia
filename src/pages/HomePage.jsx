import MovieSection from "../components/MovieSection";
import React from "react";

const HomePage = ({movieService, onMovieSelect}) => {
    // 메인에 노출할 장르 섹션
    const genreSections = [
    { title: '액션 영화', query: 'action' },
    { title: '판타지', query: 'fantasy' },
    { title: '코미디', query: 'comedy' },
    { title: '스릴러', query: 'thriller' },
    { title: '로맨틱', query: 'romance' },
];

return (
    <>
            <h2>오늘의 추천</h2>
            {genreSections.map(section => (
            <MovieSection
                key={section.query} // key는 필수로 넣어야 합니다.
                title={section.title}
                query={section.query}
                movieService={movieService}
                onMovieSelect={onMovieSelect}
            />
        ))}
    </>
)


}

export default HomePage;