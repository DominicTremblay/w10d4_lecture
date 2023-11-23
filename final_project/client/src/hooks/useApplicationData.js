import { useState, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getMovies = async () => {
    try {
      const result = await axios({
        method: 'GET',
        url: '/api/movies',
      });

      console.log(result)

      setLoading(false);
      setMovies(result.data.data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return {
    movies,
    loading,
    error,
  };
};

export default useApplicationData;