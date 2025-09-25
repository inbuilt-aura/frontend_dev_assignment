import { create } from 'zustand';
import { WorkerType } from '@/types/workers';

interface WorkersState {
  workers: WorkerType[];
  filteredWorkers: WorkerType[];
  services: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedService: string;

  // Actions
  setWorkers: (workers: WorkerType[]) => void;
  setFilteredWorkers: (workers: WorkerType[]) => void;
  setServices: (services: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedService: (service: string) => void;

  // Computed actions
  fetchWorkers: () => Promise<void>;
  filterWorkers: () => void;
  clearFilters: () => void;
}

export const useWorkersStore = create<WorkersState>((set, get) => ({
  // Initial state
  workers: [],
  filteredWorkers: [],
  services: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedService: '',

  // Basic setters
  setWorkers: (workers) => set({ workers }),
  setFilteredWorkers: (filteredWorkers) => set({ filteredWorkers }),
  setServices: (services) => set({ services }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedService: (selectedService) => set({ selectedService }),

  // API call to fetch workers
  fetchWorkers: async () => {
    const { setLoading, setError, setWorkers, setFilteredWorkers, setServices } = get();

    setLoading(true);
    setError(null);

    try {
      // Simulate API call - in real app, this would be an actual API endpoint
      const response = await fetch('/api/workers');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add fallback images to workers
      const workersWithFallbacks = data.workers.map((worker: WorkerType) => ({
        ...worker,
        fallbackImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          worker.name
        )}&size=400&background=3B82F6&color=fff&format=jpg`
      }));

      setWorkers(workersWithFallbacks);
      setFilteredWorkers(workersWithFallbacks);
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  },

  // Filter workers based on search query and selected service
  filterWorkers: () => {
    const { workers, searchQuery, selectedService } = get();

    let filtered = workers;

    // Filter by service
    if (selectedService) {
      filtered = filtered.filter(worker =>
        worker.service.toLowerCase() === selectedService.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(query) ||
        worker.service.toLowerCase().includes(query)
      );
    }

    set({ filteredWorkers: filtered });
  },

  // Clear all filters
  clearFilters: () => {
    const { workers } = get();
    set({
      searchQuery: '',
      selectedService: '',
      filteredWorkers: workers
    });
  }
}));
