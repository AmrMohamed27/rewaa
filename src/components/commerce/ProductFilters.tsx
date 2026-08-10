"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number]; // [min, max]
  stockStatuses: string[];
  attributes: Record<string, string[]>;
}

export interface FilterOption {
  id: string;
  name: string;
}

export interface AttributeFilter {
  id: string; // e.g. "color", "size"
  name: string;
  options: string[];
}

export interface ProductFiltersProps {
  /** All available category options */
  categories?: FilterOption[];
  /** All available brand options */
  brands?: FilterOption[];
  /** Custom attributes with their options (e.g. Color: Red, Blue) */
  attributes?: AttributeFilter[];
  /** Min-max price constraints in database */
  priceLimits?: [number, number];
  /** Currently active filters state */
  activeFilters: FilterState;
  /** Callback triggered whenever filters are modified */
  onChangeFilters: (filters: FilterState) => void;
  className?: string;
}

/**
 * ProductFilters displays filter groups (categories, brands, price range, stock state, custom attributes)
 * in an accessible, accordion-based design.
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories = [],
  brands = [],
  attributes = [],
  priceLimits = [0, 1000],
  activeFilters,
  onChangeFilters,
  className = "",
}) => {
  const [minPriceInput, setMinPriceInput] = useState(activeFilters.priceRange[0].toString());
  const [maxPriceInput, setMaxPriceInput] = useState(activeFilters.priceRange[1].toString());
  const [prevPriceRange, setPrevPriceRange] = useState<[number, number]>(activeFilters.priceRange);

  if (
    activeFilters.priceRange[0] !== prevPriceRange[0] ||
    activeFilters.priceRange[1] !== prevPriceRange[1]
  ) {
    setPrevPriceRange(activeFilters.priceRange);
    setMinPriceInput(activeFilters.priceRange[0].toString());
    setMaxPriceInput(activeFilters.priceRange[1].toString());
  }

  const handleCheckboxChange = (
    key: "categories" | "brands" | "stockStatuses",
    value: string,
    checked: boolean,
  ) => {
    const list = [...activeFilters[key]];
    if (checked) {
      list.push(value);
    } else {
      const idx = list.indexOf(value);
      if (idx > -1) list.splice(idx, 1);
    }

    onChangeFilters({
      ...activeFilters,
      [key]: list,
    });
  };

  const handleAttributeCheckboxChange = (
    attributeId: string,
    optionValue: string,
    checked: boolean,
  ) => {
    const currentAttrSelections = activeFilters.attributes[attributeId]
      ? [...activeFilters.attributes[attributeId]]
      : [];

    if (checked) {
      currentAttrSelections.push(optionValue);
    } else {
      const idx = currentAttrSelections.indexOf(optionValue);
      if (idx > -1) currentAttrSelections.splice(idx, 1);
    }

    const updatedAttributes = {
      ...activeFilters.attributes,
      [attributeId]: currentAttrSelections,
    };

    // Clean up empty attribute arrays
    if (updatedAttributes[attributeId].length === 0) {
      delete updatedAttributes[attributeId];
    }

    onChangeFilters({
      ...activeFilters,
      attributes: updatedAttributes,
    });
  };

  const handlePriceApply = (e: React.SubmitEvent) => {
    e.preventDefault();
    const min = parseFloat(minPriceInput) || priceLimits[0];
    const max = parseFloat(maxPriceInput) || priceLimits[1];
    onChangeFilters({
      ...activeFilters,
      priceRange: [Math.max(priceLimits[0], min), Math.min(priceLimits[1], max)],
    });
  };

  const handleClearAll = () => {
    onChangeFilters({
      categories: [],
      brands: [],
      priceRange: [...priceLimits],
      stockStatuses: [],
      attributes: {},
    });
  };

  const hasActiveFilters =
    activeFilters.categories.length > 0 ||
    activeFilters.brands.length > 0 ||
    activeFilters.stockStatuses.length > 0 ||
    Object.keys(activeFilters.attributes).length > 0 ||
    activeFilters.priceRange[0] !== priceLimits[0] ||
    activeFilters.priceRange[1] !== priceLimits[1];

  const stockStatusOptions = [
    { id: "in_stock", name: "In Stock" },
    { id: "low_stock", name: "Low Stock" },
    { id: "preorder", name: "Preorder" },
    { id: "out_of_stock", name: "Out of Stock" },
  ];

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      {/* Header with Clear Action */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 h-8 px-2 cursor-pointer"
            aria-label="Clear all applied filters"
          >
            Clear All
          </Button>
        )}
      </div>

      <Separator className="bg-border/60" />

      {/* Accordion Filter Groups */}
      <Accordion type="multiple" defaultValue={["categories", "price", "stock"]} className="w-full">
        {/* Categories Group */}
        {categories.length > 0 && (
          <AccordionItem value="categories" className="border-b border-border/60">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-4">
              <div className="flex flex-col gap-3">
                {categories.map((cat) => {
                  const isChecked = activeFilters.categories.includes(cat.id);
                  const checkboxId = `filter-category-${cat.id}`;
                  return (
                    <div key={cat.id} className="flex items-center gap-2.5">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("categories", cat.id, !!checked)
                        }
                      />
                      <Label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-none text-muted-foreground hover:text-foreground cursor-pointer select-none"
                      >
                        {cat.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Brands Group */}
        {brands.length > 0 && (
          <AccordionItem value="brands" className="border-b border-border/60">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
              Brands
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-4">
              <div className="flex flex-col gap-3">
                {brands.map((brand) => {
                  const isChecked = activeFilters.brands.includes(brand.id);
                  const checkboxId = `filter-brand-${brand.id}`;
                  return (
                    <div key={brand.id} className="flex items-center gap-2.5">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("brands", brand.id, !!checked)
                        }
                      />
                      <Label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-none text-muted-foreground hover:text-foreground cursor-pointer select-none"
                      >
                        {brand.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Group */}
        <AccordionItem value="price" className="border-b border-border/60">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <form onSubmit={handlePriceApply} className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex-1">
                  <Label htmlFor="price-min" className="sr-only">
                    Minimum Price
                  </Label>
                  <Input
                    type="number"
                    id="price-min"
                    placeholder={`Min (${priceLimits[0]})`}
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="h-8 text-xs text-foreground bg-muted/20"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-semibold">to</span>
                <div className="flex-1">
                  <Label htmlFor="price-max" className="sr-only">
                    Maximum Price
                  </Label>
                  <Input
                    type="number"
                    id="price-max"
                    placeholder={`Max (${priceLimits[1]})`}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="h-8 text-xs text-foreground bg-muted/20"
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-8 w-full text-xs font-semibold cursor-pointer"
              >
                Apply Price
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Stock Status Group */}
        <AccordionItem value="stock" className="border-b border-border/60">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
            Availability
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <div className="flex flex-col gap-3">
              {stockStatusOptions.map((status) => {
                const isChecked = activeFilters.stockStatuses.includes(status.id);
                const checkboxId = `filter-stock-${status.id}`;
                return (
                  <div key={status.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={checkboxId}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("stockStatuses", status.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={checkboxId}
                      className="text-sm font-medium leading-none text-muted-foreground hover:text-foreground cursor-pointer select-none"
                    >
                      {status.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Custom Attributes Group (Colors, Sizes, etc.) */}
        {attributes.map((attr) => (
          <AccordionItem
            key={attr.id}
            value={`attr-${attr.id}`}
            className="border-b border-border/60"
          >
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3 capitalize">
              {attr.name}
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-4">
              <div className="flex flex-col gap-3">
                {attr.options.map((option) => {
                  const isChecked = activeFilters.attributes[attr.id]?.includes(option) || false;
                  const checkboxId = `filter-${attr.id}-${option}`;
                  return (
                    <div key={option} className="flex items-center gap-2.5">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleAttributeCheckboxChange(attr.id, option, !!checked)
                        }
                      />
                      <Label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-none text-muted-foreground hover:text-foreground cursor-pointer select-none"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
