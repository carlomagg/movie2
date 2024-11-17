import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  };
}

const MovieCard: React.FC<MovieProps> = ({ movie }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the movie is already a favorite
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: any) => fav.id === movie.id));
  }, [movie.id]);

  // Toggle favorite status
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the favorite button
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: any) => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch a custom event to notify of favorites change
    window.dispatchEvent(new Event('favoritesUpdated'));
    
    // Also dispatch storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'favorites',
      newValue: JSON.stringify(updatedFavorites)
    }));
  };

  // Handle navigation to movie details
  const handleClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div 
      className="block border rounded shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="w-full"
      />
      <div className="p-2">
        <h3 className="font-bold">{movie.title}</h3>
        <p>Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}</p>
        <button
          onClick={handleFavorite}
          className={`mt-2 px-4 py-2 rounded ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;