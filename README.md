
🎬 WATCHAPEDIA 클론 프로젝트(NuPedia)

영화 데이터베이스(OMDB API)를 활용하여, 사용자에게 영화 검색 및 상세 정보를 제공하는 웹 애플리케이션.
React를 기반으로 구축되었으며, 모달 대신 라우팅을 사용한 상세 페이지 이동 기능 구현.

🚀 주요 기능 및 특징

반응형 라우팅 구현:

# 해시 기반 라우팅을 사용하여 메인(/), 검색 결과(/search), 상세 페이지(/detail/:imdbId) 간의 매끄러운 화면 전환 구현.

레이어드 아키텍처:

Presentation(컴포넌트), Service(비즈니스 로직), Data Access(Repository) 계층으로 분리하여 유지보수성과 테스트 용이성을 높였습니다.

데이터 매핑:

외부 API (OMDB)에서 제공되는 PascalCase 형태의 데이터를 애플리케이션 내부 표준인 camelCase로 변환하는 데이터 매핑 로직을 Repository 계층에서 처리 예정.

스크롤 가능한 영화 섹션:

메인 페이지에서 인기 영화 장르별 목록을 좌우 스크롤 가능한 섹션으로 제공하여 영화 탐색.

🛠️ 기술 스택 (Tech Stack)

Frontend Framework: React

Styling: CSS

API Service: Axios

Architecture: Layered Architecture (Repository Pattern)
