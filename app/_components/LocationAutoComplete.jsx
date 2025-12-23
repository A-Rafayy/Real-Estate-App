"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";

export default function LocationAutocomplete({selectedAddress, setCoordinates}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const debounceRef = useRef(null);

    const fetchPlaces = async (q) => {
        try {
            const res = await axios.get(`/api/locationiq?query=${encodeURIComponent(q)}`);
            setResults(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setSelected(null);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length < 3) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(() => fetchPlaces(value), 300);
    };

    const handleSelect = (place) => {
        console.log(place.display_name);
        selectedAddress(place.display_name);
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        setCoordinates({lat, lng});
        setQuery(place.display_name);
        setResults([]);
        setSelected({ name: place.display_name, lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
    };

    return (
        <div className='flex items-center w-full'>
            <MapPin className='h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200' />
            <div className="w-full mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search a location..."
                    className="h-10 w-full p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                />

                {results.length > 0 && (
                    <ul className="mt-2 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                        {results.map((p, index) => (
                            <li
                                 key={`${p.place_id}-${index}`}
                                onClick={() => handleSelect(p)}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                                {p.display_name}
                            </li>
                        ))}
                    </ul>
                )}

                {/* {selected && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-700">Selected Location:</h3>
          <p className="text-gray-600">{selected.name}</p>
          <p className="text-gray-500 text-sm">Lat: {selected.lat}, Lon: {selected.lon}</p>
        </div>
      )} */}
            </div>
        </div>
    );
}
