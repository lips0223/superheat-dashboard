import React from "react";
import Image from "next/image";

interface SortImageProps {
  sortDirection?: "asc" | "desc" | null;
  onSortChange?: (direction: "asc" | "desc") => void;
}

export default function SortImage({ sortDirection, onSortChange }: SortImageProps) {
  const handleSortUpClick = () => {
    // Up箭头 = 降序(desc) = 从大到小
    // 如果已经是降序，则不处理
    if (sortDirection !== "desc") {
      onSortChange?.("desc");
    }
  };

  const handleSortDownClick = () => {
    // Down箭头 = 升序(asc) = 从小到大
    // 如果已经是升序，则不处理
    if (sortDirection !== "asc") {
      onSortChange?.("asc");
    }
  };

  return (
    <>
      <span className="w-4 h-5 relative flex items-center justify-center">
        <Image
          src={sortDirection === "desc" ? "/device/sort-up_active.svg" : "/device/sort-up.svg"}
          alt="up"
          width={14}
          height={1}
          className="absolute top-[3px] cursor-pointer"
          onClick={handleSortUpClick}
        />
        <Image
          src={
            sortDirection === "asc"
              ? "/device/sort-down.svg"
              : "/device/sort-down_unactive.svg"
          }
          alt="down"
          width={14}
          height={1}
          className="absolute top-[5px] cursor-pointer"
          onClick={handleSortDownClick}
        />
      </span>
    </>
  );
}
