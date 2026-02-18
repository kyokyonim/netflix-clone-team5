const requests = {
    // legacyRequests.js (기존 클론 방식)
    fetchNowPlaying: "movie/now_playing",
    fetchNetflixOriginals: "/discover/tv?with_networks=213",
    fetchTrending: "/trending/all/week",
    fetchTopRated: "/movie/top_rated",
    fetchActionMovies: "/discover/movie?with_genres=28",
    fetchComedyMovies: "/discover/movie?with_genres=35",
    fetchHorrorMovies: "/discover/movie?with_genres=27",
    fetchRomanceMovies: "/discover/movie?with_genres=10749",
    fetchDocumentaries: "/discover/movie?with_genres=99",
    // feedRequests.js (새 구조 전용)
    fetchHero: "/trending/all/week",
    fetchKrSeriesPopular: "/discover/tv?with_original_language=ko&sort_by=popularity.desc",
    fetchKrMoviesPopular: "/discover/movie?with_original_language=ko&sort_by=popularity.desc",
    fetchUsDrama: "/discover/tv?with_original_language=en&sort_by=popularity.desc",
    fetchTrendingMovies: "/trending/movie/week",
    fetchRomancePopular: "/discover/movie?with_genres=10749&sort_by=popularity.desc",
    };

export default requests;