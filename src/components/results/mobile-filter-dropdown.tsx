import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Check } from "lucide-react";

interface MobileFilterDropdownProps {
  currentFilter: "all" | "yes" | "no";
  onFilterChange: (filter: "all" | "yes" | "no") => void;
}

export function MobileFilterDropdown({ currentFilter, onFilterChange }: MobileFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = [
    { value: "all" as const, label: "All Queries" },
    { value: "yes" as const, label: "Brand Present" },
    { value: "no" as const, label: "Brand Absent" }
  ];

  const currentLabel = filterOptions.find(option => option.value === currentFilter)?.label || "All Queries";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-2 bg-background/95 backdrop-blur-sm border-border/50"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
          <span className="sm:hidden">Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-lg border-border/50">
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onFilterChange(option.value);
              setIsOpen(false);
            }}
            className="flex items-center justify-between hover:bg-muted/50 cursor-pointer"
          >
            <span>{option.label}</span>
            {currentFilter === option.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}