import React, { useState, useEffect } from "react";

const API_KEY = "live_hICiNgVfPOnQToN45ueuOhgISMIZRR15MyFagqKjdLvnfKqp3SQEGbfO7YzmeKty"; // Replace with your Cat API key
const BASE_URL = "https://api.thecatapi.com/v1";

export default function CatGallery() {
  const [images, setImages] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [limit, setLimit] = useState(6); // Default limit
  const [loadingMore, setLoadingMore] = useState(false); // Separate loading state for Load More button
  const [error, setError] = useState(null);

  // Fetch available cat breeds
  useEffect(() => {
    fetch(`${BASE_URL}/breeds?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setBreeds(data))
      .catch((err) => console.error("Error fetching breeds:", err));
  }, []);

  // Fetch cat images (filtered by breed & limit)
  const fetchCats = (breedId = "", imgLimit = limit, append = false) => {
    if (append) {
      setLoadingMore(true); // Only set loading for Load More button
    } else {
      setImages([]); // Clear images on new fetch
    }
    setError(null);

    let url = `${BASE_URL}/images/search?limit=${imgLimit}&api_key=${API_KEY}&size=med`;
    if (breedId) url += `&breed_ids=${breedId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setImages((prevImages) => (append ? [...prevImages, ...data] : data)); // Append or replace images
        setLoadingMore(false);
      })
      .catch((err) => {
        setError("Failed to fetch cat images. Please try again.");
        setLoadingMore(false);
      });
  };

  // Load initial cat images
  useEffect(() => {
    fetchCats();
  }, [limit]); // Reload when limit changes

  // Handle breed selection
  const handleBreedChange = (e) => {
    setSelectedBreed(e.target.value);
    fetchCats(e.target.value, limit, false); // Replace images
  };

  // Handle limit selection
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    fetchCats(selectedBreed, newLimit, false); // Replace images
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">🐱 Random Cat Gallery</h1>

      {/* Filters: Breed & Limit */}
      <div className="flex justify-center gap-6 mb-4">
        {/* Breed Filter */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Filter by Breed:</label>
          <select
            className="p-2 border rounded"
            value={selectedBreed}
            onChange={handleBreedChange}
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
        </div>

        {/* Limit Filter */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Number of Images:</label>
          <select
            className="p-2 border rounded"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="rounded-lg shadow-lg overflow-hidden img-card">
            <img
              src={img.url}
              alt="Cat"
              className="w-full h-40 object-cover "
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => fetchCats(selectedBreed, limit, true)} // Append new images
          disabled={loadingMore} // Disable while loading
        >
          {loadingMore ? "Loading..." : "Load More 😻"}
        </button>
      </div>
    </div>
  );
}
