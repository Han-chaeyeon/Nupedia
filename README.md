# 🎬 WATCHAPEDIA 프로젝트

## 1. 프로젝트 목표 및 개요

목표: OMDB API 활용, 영화 검색 및 상세 정보 제공 웹 애플리케이션 구축.

기반: React 사용.

핵심: 모달 대신 라우팅을 사용한 상세 페이지 이동 기능 구현.

## 2. 주요 기능 및 아키텍처 특징

라우팅: 해시(#) 기반 반응형 라우팅 구현 (/, /search, /detail/:imdbId).

아키텍처: Layered Architecture (3계층) 분리.

Presentation: UI 담당 (React 컴포넌트).

Service: 핵심 비즈니스 로직 및 데이터 가공 담당.

Repository: 외부 API 통신 및 데이터 매핑 전담. (API의 PascalCase 키를 앱 표준 camelCase로 변환 처리함.)

UI: 스크롤 가능한 장르별 영화 섹션 제공.

## 3. 기술 스택

프론트엔드: React, CSS.

데이터 통신: Axios.

설계 패턴: Layered Architecture (Repository Pattern).

## 4. 실행 요약

클론: Repository 클론.

설치: npm install 실행.

API: OMDB 키 설정 (필수).

실행: npm start로 로컬 실행.
