import React, { useState, useEffect } from "react";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";

interface Result {
  name: string;
  description?: string;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem("searchTerm");
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
      fetchResults(savedSearchTerm);
    } else {
      fetchResults("");
    }
  }, []);

  const fetchResults = async (term: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://swapi.dev/api/people/?search=${term.trim()}`,
      );
      setResults(response.data.results);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    localStorage.setItem("searchTerm", trimmedTerm);
    fetchResults(trimmedTerm);
  };

  return (
    <ErrorBoundary>
      <div>
        <div style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
          <button
            onClick={() => {
              throw new Error("Test error");
            }}
          >
            Throw Error
          </button>
        </div>
        <div style={{ padding: "20px" }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            results.map((result, index) => (
              <div key={index}>
                <h3>{result.name}</h3>
                <p>{result.description || "No description available."}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
