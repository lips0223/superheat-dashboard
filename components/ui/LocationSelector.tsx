"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "@/app/context/LocationContext";

const locationOptions = [
  { value: "all", label: "All locations" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "new-york", label: "New York" },
  { value: "berlin", label: "Berlin" },
  { value: "london", label: "London" },
];

export default function LocationSelector() {
  const { selectedLocation, setSelectedLocation } = useLocation();

  return (
    <Select
      value={selectedLocation}
      onValueChange={setSelectedLocation}
    >
      <SelectTrigger className="w-[200px] shadow-none  focus-visible:ring-0 focus-visible:ring-offset-0 fouces:border-none">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent className="focues:border-none hover:border-none">
        {locationOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
