import { useState } from "react";

function MovieSearchUI({ onSearch }) { 
    const [title, setTitle] = useState('');
    
    // 검색 버튼 클릭 또는 Enter 키 입력 시 실행되는 함수
    const handleSearch = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        const trimmedTitle = title.trim();
        
        // 검색어가 비어있을 경우 콘솔에 메시지를 출력하고 종료
        if (trimmedTitle === '') {
            console.log('검색어를 입력해 주세요.'); 
            return;
        }
        
        // 유효한 검색어가 있을 경우, 상위 컴포넌트로 검색어 전달
        if (onSearch) {
            onSearch(trimmedTitle); 
        }
        
        // 입력 필드 초기화
        setTitle('');
    };

    return (
        <nav className="search-nav-bar">
            
            <form onSubmit={handleSearch} className="search-form">
                
                <div className="search-input-container">
                    
                    <input
                        className="search-input-field"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="영화, TV 시리즈 검색..."
                    />
                    
                    <button 
                        type="submit" 
                        className="search-button"
                        title="검색"
                    >
                        <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </button>
                </div>
            </form>
        </nav>
    );
}

export default MovieSearchUI;