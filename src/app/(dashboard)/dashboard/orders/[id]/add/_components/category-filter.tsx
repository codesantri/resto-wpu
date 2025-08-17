"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { Category } from "@/validations/category-validation";

interface CategoryFilterProps {
  categories: Category[];
  currentFilter: string | number;
  onChangeFilter: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  currentFilter,
  onChangeFilter,
}: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -150, // jarak scroll, bisa disesuaikan
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 150, // jarak scroll, bisa disesuaikan
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 lg:w-2/3">
      <Button className="bg-muted cursor-pointer" variant="ghost" onClick={scrollLeft}>
        <ChevronLeftIcon className="size-6 text-teal-500" />
      </Button>

      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
      >
        <Button
          className="cursor-pointer flex-shrink-0"
          onClick={() => onChangeFilter("")}
          variant={currentFilter === "" ? "default" : "outline"}
        >
          All
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            className="cursor-pointer flex-shrink-0 w-35 px-2"
            onClick={() => onChangeFilter(category.id)}
            variant={currentFilter === category.id ? "default" : "outline"}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <Button className="bg-muted cursor-pointer" variant="ghost" onClick={scrollRight}>
        <ChevronRightIcon className="size-6 text-teal-500" />
      </Button>
    </div>
  );
}
