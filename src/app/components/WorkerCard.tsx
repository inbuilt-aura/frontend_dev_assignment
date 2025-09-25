"use client";
import { WorkerType } from "@/types/workers";
import Image from "next/image";
import { useState } from "react";

interface WorkerCardProps {
  worker: WorkerType;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
      <div className="w-full h-48 relative group">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}
        <Image
          src={imageError ? (worker.fallbackImage || worker.image) : worker.image}
          alt={`${worker.name} - ${worker.service} professional`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvPY8U4jQB5aAcw/9k="
          onError={handleImageError}
          onLoad={handleImageLoad}
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {worker.name}
        </h2>
        <p className="text-gray-600 mb-2">{worker.service}</p>
        <p className="text-lg font-bold text-green-600">
          ₹{Math.round(worker.pricePerDay * 1.18)} / day
        </p>
      </div>
    </div>
  );
}
