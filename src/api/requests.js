const requests = {
  fetchNowPlaying: "/movie/now_playing",
  fetchNetflixOriginals: "/discover/tv?with_networks=213",
  fetchTrending: "/trending/all/week",
  fetchTopRated: "/movie/top_rated",
  // ...
  fetchVideos: (mediaType, id) => `/${mediaType}/${id}/videos`,
  fetchDetail: (mediaType, id) => `/${mediaType}/${id}?language=ko-KR`,
};

export default requests;