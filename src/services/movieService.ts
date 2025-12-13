import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!ACCESS_TOKEN) {
  console.warn('TMDB access token is missing. Add VITE_TMDB_TOKEN to .env.local');
}

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

interface SearchMoviesResponse {
  results: Movie[];
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data } = await tmdb.get<SearchMoviesResponse>('/search/movie', {
    params: {
      query: trimmed,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
  });

  return data.results;
}


