import { WorkerType } from "@/types/workers";
import workersData from "../../workers.json";

// Generate fallback avatar URL for a worker
export const getFallbackAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=400&background=3B82F6&color=fff&format=jpg`;
};

// Get workers with fallback image URLs
export const getWorkers = (): WorkerType[] => {
  return workersData.map((worker: WorkerType & { fallbackImage?: string }) => ({
    ...worker,
    fallbackImage: getFallbackAvatar(worker.name)
  })) as WorkerType[];
};

export const getServices = (): string[] => {
  return Array.from(
    new Set(workersData.map((worker: WorkerType) => worker.service))
  ).sort();
};
