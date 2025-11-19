import { useState } from "react";

function MovieSearchUI({ onSearch }) { 
    const [title, setTitle] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        
        // 🚨 Service를 직접 호출하지 않고, props로 받은 함수를 호출합니다.
        if (onSearch) {
            onSearch(title); // 검색어를 상위 컴포넌트로 전달
        }
    };

    return (
        <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="영화 제목을 입력하세요"
            />
            <button type="submit">검색</button>
        </form>
    );
}

export default MovieSearchUI;