import React, { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown, Search, MapPin, X } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  onSearch: (query: string, location: string) => void;
}

interface Filters {
  searchName: string;
  type: string;
  studentsPerRoom: string;
  food: boolean;
  verified: boolean;
  sortByRatings: boolean;
  rentRange: [number, number];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
}

const filterOptions = {
  Locality: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield"],
  Type: ["All", "boys", "girls", "cowed"],
  "Students/Room": ["Any", "1", "2", "3+"],
  "Preferred By": ["Students", "Working Professionals", "Both"],
};

const initialFilters: Filters = {
  searchName: "",
  type: "All",
  studentsPerRoom: "Any",
  food: false,
  verified: false,
  sortByRatings: false,
  rentRange: [0, 10000],
  wifi: false,
  ac: false,
  mess: false,
  solar: false,
  studyRoom: false,
  tuition: false,
};

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("put your location");
  const filterButtons = Object.keys(filterOptions);

  useEffect(() => {
    const filterBar = filterBarRef.current;
    if (!filterBar) return;

    let filterBarTop =
      filterBar.getBoundingClientRect().top + window.pageYOffset;

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsSticky(scrollPosition > filterBarTop);
    };

    const handleResize = () => {
      if (filterBar) {
        filterBarTop =
          filterBar.getBoundingClientRect().top + window.pageYOffset;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (filter: string) => {
    setOpenDropdown(openDropdown === filter ? null : filter);
  };

  const handleFilterSelect = (filter: string, option: string) => {
    switch (filter) {
      case "Type":
        handleFilterChange("type", option);
        break;
      case "Students/Room":
        handleFilterChange("studentsPerRoom", option);
        break;
    }
    setOpenDropdown(null);
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  // Update query state when filters.searchName changes
  useEffect(() => {
    setQuery(filters.searchName);
  }, [filters.searchName]);

  const clearAllFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const handleSearch = () => {
    onSearch(query, location);
    handleFilterChange("searchName", query);
  };

  return (
    <div
      ref={filterBarRef}
      className={`p-4 bg-white transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : ""
      }`}
      style={{
        position: isSticky ? "fixed" : "static",
        top: isSticky ? "0" : "auto",
        left: 0,
        right: 0,
      }}
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* <div className="flex items-center space-x-1 flex-grow">
          <div className="flex-grow flex items-center border-2 border-sky-200 rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-400">
            <input
              type="text"
              placeholder="Search Hostel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-1 py-1 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <div className="flex items-center pr-1">
              <div className="flex items-center space-x-2">
                <MapPin size={20} className="text-sky-500" />
              </div>
              <button
                onClick={handleSearch}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold p-2 rounded-full transition duration-300 ml-2"
              >
                <Search size={15} />
              </button>
            </div>
          </div>
        </div> */}

        {filterButtons.map((filter) => (
          <div key={filter} className="relative">
            <button
              onClick={() => toggleDropdown(filter)}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-sky-100 rounded-full border border-gray-300 w-40"
            >
              <span className="truncate">
                {filter}:{" "}
                {filter === "Type"
                  ? filters.type
                  : filter === "Students/Room"
                  ? filters.studentsPerRoom
                  : "Any"}
              </span>
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  openDropdown === filter ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === filter && (
              <div className="absolute z-10 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg">
                {filterOptions[filter].map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm hover:bg-sky-100 cursor-pointer"
                    onClick={() => handleFilterSelect(filter, option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-sky-100"
        >
          <Filter className="w-3 h-4 mr-2" />
          More Filters
        </button>
        <button
          onClick={clearAllFilters}
          className="flex items-center px-4 py-2 text-sm rounded-full border border-red-300 text-red-500 hover:bg-red-100"
        >
          <X className="w-4 h-4 mr-2" />
          Clear
        </button>
        <button
          onClick={() =>
            handleFilterChange("sortByRatings", !filters.sortByRatings)
          }
          className="flex items-center px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-sky-100"
        >
          Sort: {filters.sortByRatings ? "Ratings" : "Popular"}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <h2 className="text-xl font-bold mb-4">More Filters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">Amenities</h3>
                {[
                  "food",
                  "wifi",
                  "ac",
                  "mess",
                  "solar",
                  "studyRoom",
                  "tuition",
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters[amenity as keyof Filters] as boolean}
                      onChange={(e) =>
                        handleFilterChange(
                          amenity as keyof Filters,
                          e.target.checked
                        )
                      }
                    />
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Rent Range</h3>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.rentRange[1]}
                onChange={(e) =>
                  handleFilterChange("rentRange", [0, parseInt(e.target.value)])
                }
                className="w-full"
              />
              <div className="flex justify-between">
                <span>₹0</span>
                <span>₹{filters.rentRange[1]}</span>
              </div>
            </div>
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.verified}
                onChange={(e) =>
                  handleFilterChange("verified", e.target.checked)
                }
              />
              Verified Only
            </label>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-[#87CEEB] text-white px-4 py-2 rounded-full"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
