import { useState, useEffect } from "react";

const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 
const BASE_URL = "https://api.themoviedb.org/3";

/** 
  @param {string} query 
  @param {number} genreId 
 */
 
export const useMovies = (query = "", genreId = 0, page = 1, sortBy = "popularity.desc", decade = "", language = "") => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      let endpoint = "";

      if (query) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      } else {
        const isDefault = genreId === 0 && sortBy === "popularity.desc" && !decade && !language;
        if (isDefault) {
          endpoint = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`;
        } else {
          endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;
          if (genreId !== 0) endpoint += `&with_genres=${genreId}`;
          if (language) endpoint += `&with_original_language=${language}`;
          if (decade) {
            const startYear = parseInt(decade);
            endpoint += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${startYear + 9}-12-31`;
          }
        }
      }

      try {
        const res = await fetch(endpoint);
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        
        setHasMore(data.page < data.total_pages);
        
        if (page === 1) {
          setMovies(data.results || []);
        } else {
          setMovies((prev) => {
            const newMovies = data.results || [];
            // filter out duplicates just in case
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = newMovies.filter(m => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [query, genreId, page, sortBy, decade, language]); 

  return { movies, loading, loadingMore, hasMore, error };
};