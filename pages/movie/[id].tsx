import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: Genre[];
  cast: Cast[];
}

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        try {
          const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=c54c4e04193f4ad4ade00404335f804b&language=en-US`
          );

          const castResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=c54c4e04193f4ad4ade00404335f804b&language=en-US`
          );

          const castData = castResponse.data.cast.slice(0, 10); // Get top 10 cast
          setMovie({ ...movieResponse.data, cast: castData });
        } catch (error) {
          console.error('Error fetching movie details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [id]);

  if (loading) return <p>Loading movie details...</p>;
  if (!movie) return <p>Movie not found!</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="mb-4 rounded"
      />
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average}
      </p>
      <p className="my-4">
        <strong>Overview:</strong> {movie.overview}
      </p>
      <div>
        <h2 className="text-2xl font-bold mb-2">Genres</h2>
        <ul className="list-disc pl-5">
          {movie.genres.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {movie.cast.map((castMember) => (
            <div key={castMember.id} className="flex items-center space-x-4">
              <img
                src={
                  castMember.profile_path
                    ? `https://image.tmdb.org/t/p/w200/${castMember.profile_path}`
                    : '/placeholder-profile.png'
                }
                alt={castMember.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{castMember.name}</p>
                <p className="text-sm text-gray-600">as {castMember.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
};

export default MovieDetails;
