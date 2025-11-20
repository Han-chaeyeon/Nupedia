import axios from "axios";
import { OMDB_BASE_URL } from "../config.js";
import { MovieRepository } from "./interfaces/MovieRepository";

// API 호출용 레포지토리
export class OmdbMovieRepository extends MovieRepository {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        console.log(this.apiKey);
    }

    // 단일 영화 상세 조회
    async getMovieBytitle(title) {
        console.log('OMDb API 호출 시작');

       try {
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: this.apiKey,
                t:title,
                r:'json',
                plot:'short'
            }
        });
        
        return response.data;

       } catch(error) {
            console.log(error);
            return {
                Response:"False", Error:"네트워크 오류 또는 API 호출 실패"
            };
       }
    } 

    // 목록 검색 구현
    async searchMovies(query, page = 1) {
        console.log(`[Repository] OMDb API 목록 검색 시작: ${query}, Page: ${page}`);
        try {
            const response = await axios.get(OMDB_BASE_URL, {
                params: {
                    apikey: this.apiKey,
                    s: query, // 검색 목록 요청
                    page: page,
                    type: 'movie' // 영화만 검색하도록 제한
                },
            });

            return response.data;

        } catch (error) {
            console.error("[Repository Error]", error);
            return {
                Response: "False", Error: "네트워크 오류 또는 목록 검색 실패"
            };
        }
    }

    // ID 기반 상세 조회 구현
    async getMovieById(imdbId) {
        console.log(`[Repository] OMDb API ID 조회 시작: ${imdbId}`);
        try {
            const response = await axios.get(OMDB_BASE_URL, {
                params: {
                    apikey: this.apiKey,
                    i: imdbId, // i 파라미터를 사용하여 ID 기반 조회
                    r: 'json',
                    plot: 'full' 
                },
            });
            return response.data; 

        } catch (error) {
            console.error("[Repository Error]", error);
            return { Response: "False", Error: "네트워크 오류 또는 ID 조회 실패" };
        }
    }

}