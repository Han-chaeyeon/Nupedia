import React from 'react';

function LoadingSpinner() {
    // 간단한 로딩 스피너 UI (스타일은 최소화)
    return (
        <div 
            style={{ 
                textAlign: 'center', 
                padding: '20px', 
                fontSize: '1.2em', 
                color: '#333' 
            }}
        >
            로딩 중... ⏳
        </div>
    );
}

// ⭐️ 수정: export default를 사용하여 내보냅니다.
export default LoadingSpinner;