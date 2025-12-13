import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { searchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import type { SearchMoviesResult } from '../../services/movieService';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return;

    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<SearchMoviesResult>({
    queryKey: ['movies', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length > 0,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    if (!isSuccess) return;

    if (movies.length === 0) {
      toast.error('No movies found for your request.', { id: `no-movies-${q}` });
    }
  }, [query, isSuccess, movies.length]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

















