import React, { useState } from "react";
import type { MediaCard } from "../types/app";
import "./Banner.css";
import styled from "styled-components";

interface BannerProps {
  hero: MediaCard | null;
}

export default function Banner({ hero }: BannerProps) {
  const [isClicked, setIsClicked] = useState(false);

  if (!hero) return null;

  const truncate = (str?: string, n?: number) => {
    if (!str || !n) return "";
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (!isClicked) {
    return (
      <header
        className="banner"
        style={{
          backgroundImage: `url(${hero.backdropUrl})`,
          backgroundPosition: "top center",
          backgroundSize: "cover",
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">{hero.title}</h1>

          <div className="banner__buttons">
            <button
              className="banner__button play"
              onClick={() => setIsClicked(true)}
            >
              Play
            </button>
            <button className="banner__button info">
              More Information
            </button>
          </div>

          <h1 className="banner__description">
            {truncate(hero.overview, 100)}
          </h1>
        </div>
        <div className="banner--fadeBottom" />
      </header>
    );
  }

  return null;
}

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.65;
  border: none;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
`;
