import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const API_KEY = "4fdd0d59a1f17e38b912e065674f80d8"; 
const BASE_URL = "https://api.themoviedb.org/3";

/** 
  @param {string} query 
  @param {number[]} genreIds 
 */
 
export const useMovies = (query = "", genreIds = [], page = 1, sortBy = "popularity.desc", minYear = "", maxYear = "", minRating = 0, minVotes = 0, language = "", maxRuntime = null, providers = [], mediaType = "movie") => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

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
        endpoint = `${BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=${lang}`;
      } else {
        const isDefault = genreIds.length === 0 && sortBy === "popularity.desc" && !minYear && !maxYear && minRating === 0 && minVotes === 0 && !language && !maxRuntime && providers.length === 0;
        if (isDefault) {
          endpoint = `${BASE_URL}/trending/${mediaType}/day?api_key=${API_KEY}&page=${page}&language=${lang}`;
        } else {
          endpoint = `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&language=${lang}`;
          if (genreIds.length > 0) endpoint += `&with_genres=${genreIds.join(',')}`;
          if (language) endpoint += `&with_original_language=${language}`;
          const dateField = mediaType === "movie" ? "primary_release_date" : "first_air_date";
          if (minYear) {
            endpoint += `&${dateField}.gte=${minYear}-01-01`;
          }
          if (maxYear) {
            endpoint += `&${dateField}.lte=${maxYear}-12-31`;
          }
          if (minRating > 0) {
            endpoint += `&vote_average.gte=${minRating}`;
          }
          if (minVotes > 0) {
            endpoint += `&vote_count.gte=${minVotes}`;
          }
          if (maxRuntime) {
            endpoint += `&with_runtime.lte=${maxRuntime}`;
          }
          if (providers.length > 0) {
            endpoint += `&with_watch_providers=${providers.join('|')}&watch_region=US`;
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
  }, [query, genreIds.join(','), page, sortBy, minYear, maxYear, minRating, minVotes, language, maxRuntime, providers.join(','), mediaType, lang]); 

  return { movies, loading, loadingMore, hasMore, error };
};