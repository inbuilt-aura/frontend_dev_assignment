"use client";
import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import WorkerCard from "./components/WorkerCard";
import { useWorkersStore } from "@/lib/store";

export default function WorkersPage() {
  const {
    workers,
    loading,
    error,
    searchQuery,
    selectedService,
    setSearchQuery,
    setSelectedService,
    fetchWorkers,
    filterWorkers
  } = useWorkersStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  const itemsPerPage = 12;

  // Load workers data on mount
  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Filter workers when dependencies change
  useEffect(() => {
    filterWorkers();
  }, [searchQuery, selectedService, workers, filterWorkers]);

  // Filter and sort workers
  const filteredAndSortedWorkers = useMemo(() => {
    let filtered = workers;

    // Filter by service
    if (selectedService && selectedService !== "all") {
      filtered = filtered.filter(
        (worker) => worker.service === selectedService
      );
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      filtered = filtered.filter((worker) => {
        const price = worker.pricePerDay;
        if (selectedPriceRange === "500+") {
          return price >= 500;
        }
        return price >= min && price <= max;
      });
    }

    // Filter by search term
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchLower) ||
          worker.service.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [workers, selectedService, selectedPriceRange, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedService, selectedPriceRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedWorkers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorkers = filteredAndSortedWorkers.slice(startIndex, endIndex);

  // Get unique services for filter
  const services = useMemo(() => {
    return Array.from(
      new Set(workers.map((worker) => worker.service))
    ).sort();
  }, [workers]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Our Workers
      </h1>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="text-red-800 text-sm">
            Error: {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Service Filter */}
                <div className="w-full sm:w-48">
                  <select
                    value={selectedService || "all"}
                    onChange={(e) => setSelectedService(e.target.value === "all" ? "" : e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Services</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="w-full sm:w-48">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-200">₹0 - ₹200/day</option>
                    <option value="200-400">₹200 - ₹400/day</option>
                    <option value="400-500">₹400 - ₹500/day</option>
                    <option value="500+">₹500+/day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {paginatedWorkers.length} of {filteredAndSortedWorkers.length} workers
              {selectedService && selectedService !== "all" && ` in ${selectedService}`}
              {selectedPriceRange !== "all" &&
                ` (${selectedPriceRange === "500+" ? "₹500+" : `₹${selectedPriceRange.split("-").join(" - ₹")}`}/day)`}
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {paginatedWorkers.length > 0 ? (
              paginatedWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No workers found</div>
                <div className="text-gray-400 text-sm">Try adjusting your search terms or filters</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ← Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
