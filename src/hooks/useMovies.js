import { useState, useEffect } from "react";

const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 
const BASE_URL = "https://api.themoviedb.org/3";

/** 
  @param {string} query 
  @param {number} genreId 
 */
 
export const useMovies = (query = "", genreId = 0) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      let endpoint = "";

      if (query) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
      } else if (genreId !== 0) {
        endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
      } else {
        endpoint = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`;
      }

      try {
        const res = await fetch(endpoint);
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, genreId]); 

  return { movies, loading, error };
};