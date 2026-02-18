import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import MovieModal from "./MovieModal";
import "./Row.css";

// Swiper
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import type { MediaCard, SectionType } from "../types/app";

// Row에서 받을 props 타입
interface RowProps {
  isLargeRow?: boolean;
  title: string;
  id: string;
  fetchUrl?: string; // legacy 방식
  items?: MediaCard[]; // 새 구조
  variant?: SectionType; // "row" | "top10"
}

// legacy(TMDB raw) 최소 형태로 정의
type LegacyMovie = {
  id: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  title?: string;
  name?: string;
  original_name?: string;
};

type MovieLike = MediaCard | LegacyMovie;

export default function Row({
  isLargeRow = false,
  title,
  id,
  fetchUrl,
  items,
  variant,
}: RowProps) {
  const [movies, setMovies] = useState<MovieLike[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [movieSelected, setMovieSelected] = useState<MovieLike | null>(null);

  useEffect(() => {
    // 새 구조: items가 오면 fetch 하지 않음
    if (Array.isArray(items) && items.length) {
      setMovies(items);
      return;
    }

    // legacy 방식 유지
    if (!fetchUrl) {
      setMovies([]);
      return;
    }

    const fetchMovieData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results as LegacyMovie[]);
    };

    fetchMovieData();
  }, [fetchUrl, items]);

  const handleClick = (movie: MovieLike) => {
    setModalOpen(true);
    setMovieSelected(movie);
  };

  const getImgSrc = (movie: MovieLike): string => {
    // 새 구조(정규화) 지원: posterUrl/backdropUrl
    const m = movie as MediaCard;
    if (m.posterUrl || m.backdropUrl) {
      const large = m.posterUrl || m.backdropUrl || "";
      const small = m.backdropUrl || m.posterUrl || "";
      return isLargeRow ? large : small;
    }

    // legacy(TMDB raw) 지원: poster_path/backdrop_path
    const legacy = movie as LegacyMovie;
    const path = isLargeRow ? legacy.poster_path : legacy.backdrop_path;
    return path ? `https://image.tmdb.org/t/p/original/${path}` : "";
  };

  const getAlt = (movie: MovieLike): string => {
    const m = movie as any;
    return m.title || m.name || m.original_name || "";
  };

  return (
    <section className="row">
      <h2>{title}</h2>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        loop={true}
        breakpoints={{
          1378: { slidesPerView: 6, slidesPerGroup: 6 },
          998: { slidesPerView: 5, slidesPerGroup: 5 },
          625: { slidesPerView: 4, slidesPerGroup: 4 },
          0: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
      >
        <div id={id} className="row__posters">
          {movies.map((movie) => (
            <SwiperSlide key={(movie as any).id}>
              <img
                style={{ padding: "25px 0" }}
                className={`row__poster ${isLargeRow ? "row__posterLarge" : ""} ${
                  variant === "top10" ? "row__posterTop10" : ""
                }`}
                src={getImgSrc(movie)}
                alt={getAlt(movie)}
                onClick={() => handleClick(movie)}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      {modalOpen && movieSelected && (
        <MovieModal {...(movieSelected as any)} setModalOpen={setModalOpen} />
      )}
    </section>
  );
}
