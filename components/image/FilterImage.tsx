"use client";
import Image from "next/image";
import React, { forwardRef } from "react";

interface FilterImageProps {
  isClicked?: boolean;
}

const FilterImage = forwardRef<HTMLDivElement, FilterImageProps>(({ isClicked }, ref) => {
  return (
    <div ref={ref} className="relative">
      <Image
        src={
          isClicked ? "/device/filter_active.svg" : "/device/filter_unactive.svg"
        }
        alt="filter-icon"
        width={16}
        height={16}
        className="cursor-pointer"
      />
    </div>
  );
});

FilterImage.displayName = "FilterImage";

export default FilterImage;
