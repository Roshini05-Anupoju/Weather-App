import React, { useState, useEffect } from "react";
import search_icon from "../assets/search.png";

const SearchBar = ({ inputRef, onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${value}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_GEODB_API_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar" style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter the city"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
      />

      <img
        src={search_icon}
        alt="searchIcon"
        onClick={() => onSearch(query)}
        style={{ cursor: "pointer" }}
      />

      
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            listStyle: "none",
            padding: 0,
            margin: 0,
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {loading && <li style={{ padding: "8px" }}>Loading...</li>}
          {suggestions.map((city) => (
            <li
              key={city.id}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => {
                setQuery(`${city.city}, ${city.country}`);
                setSuggestions([]);
                onSearch(city.city); 
              }}
            >
              {city.city}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

