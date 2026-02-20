//UI에서 쓰는 정규화 타입
// src/types/app.ts

// UI에서 공통으로 쓰는 "정규화된" 미디어 카드 타입 
export type MediaType = "movie" | "tv" | "person" | "unknown";

export interface MediaCard {
  id: number;
  title: string;
  originalTitle?: string;
  mediaType: MediaType;
  posterUrl?: string;    
  backdropUrl?: string;  
  overview?: string;
  releaseDate?: string; // movie: release_date, tv: first_air_date
  adult?: boolean;
  popularity?: number;
  voteAverage?: number;
  voteCount?: number;
  rank?: number;
  raw?: unknown;
}

export type SectionType = "row" | "top10";

export interface HomeSection {
  key: string;          
  title: string;        
  type: SectionType;    
  items: MediaCard[];
}

export interface HomeFeed {
  hero: MediaCard | null;
  sections: HomeSection[];
}

// 상세 페이지/모달에 묶어서 쓰고 싶으면(선택) 
export interface DetailBundle {
  item: MediaCard;

  trailerYoutubeKey?: string | null;

  recommendations: MediaCard[];

  cast: Array<{
    id: number;
    name: string;
    character: string;
    profileUrl?: string;
  }>;

  genres?: string[];
  runtime?: number;
  numberOfSeasons?: number;

  videos?: Array<{
    id: string;
    key: string;
    name?: string;
    site?: string;
    type?: string;
  }>;

  reviews?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt?: string;
  }>;
}
