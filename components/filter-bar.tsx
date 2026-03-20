"use client"

import { useState } from "react"
import { X, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getAllPeople, getAllLocations, getAllVibes, getAllMonths, shotOnOptions } from "@/lib/data"

export interface Filters {
  person: string | null
  month: string | null
  location: string | null
  vibe: string | null
  shotOn: string | null
  search: string
}

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

function FilterButton({
  label,
  value,
  options,
  onSelect,
  onClear,
}: {
  label: string
  value: string | null
  options: string[]
  onSelect: (value: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 border-border bg-background text-sm font-normal",
            value && "border-foreground/30 bg-secondary"
          )}
        >
          {value || label}
          {value ? (
            <X
              className="ml-2 h-3 w-3 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            />
          ) : (
            <ChevronDown className="ml-2 h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="flex flex-col">
          {options.map((option) => (
            <button
              key={option}
              className={cn(
                "px-3 py-2 text-sm text-left rounded-sm hover:bg-accent transition-colors",
                value === option && "bg-accent font-medium"
              )}
              onClick={() => {
                onSelect(option)
                setOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const people = getAllPeople()
  const locations = getAllLocations()
  const vibes = getAllVibes()
  const months = getAllMonths()

  const hasActiveFilters =
    filters.person || filters.month || filters.location || filters.vibe || filters.shotOn

  const clearAllFilters = () => {
    onFiltersChange({
      person: null,
      month: null,
      location: null,
      vibe: null,
      shotOn: null,
      search: "",
    })
  }

  return (
    <div className="flex flex-col gap-4 py-6 border-b border-border">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by location or person..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-10 h-10 bg-background border-border"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">
          Filter by
        </span>

        <FilterButton
          label="Person"
          value={filters.person}
          options={people}
          onSelect={(value) => onFiltersChange({ ...filters, person: value })}
          onClear={() => onFiltersChange({ ...filters, person: null })}
        />

        <FilterButton
          label="Month"
          value={filters.month}
          options={months}
          onSelect={(value) => onFiltersChange({ ...filters, month: value })}
          onClear={() => onFiltersChange({ ...filters, month: null })}
        />

        <FilterButton
          label="Location"
          value={filters.location}
          options={locations}
          onSelect={(value) => onFiltersChange({ ...filters, location: value })}
          onClear={() => onFiltersChange({ ...filters, location: null })}
        />

        <FilterButton
          label="Vibe"
          value={filters.vibe}
          options={vibes}
          onSelect={(value) => onFiltersChange({ ...filters, vibe: value })}
          onClear={() => onFiltersChange({ ...filters, vibe: null })}
        />

        <FilterButton
          label="Shot on"
          value={filters.shotOn}
          options={shotOnOptions}
          onSelect={(value) => onFiltersChange({ ...filters, shotOn: value })}
          onClear={() => onFiltersChange({ ...filters, shotOn: null })}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 text-sm text-muted-foreground hover:text-foreground ml-2"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
