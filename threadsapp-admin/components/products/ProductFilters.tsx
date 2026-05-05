"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BrandLite, CategoryLite } from "@/types/product.types";

export function ProductFilters({ categories, brands }: { categories: CategoryLite[]; brands: BrandLite[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const updateParam = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchInput value={searchParams.get("search") ?? ""} onChange={(value) => updateParam("search", value)} placeholder="Search product name" />
        <Select onValueChange={(value) => updateParam("category", value)} value={searchParams.get("category") ?? ""}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((category) => <SelectItem key={category.id} value={category.slug}>{category.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => updateParam("brand", value)} value={searchParams.get("brand") ?? ""}>
          <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
          <SelectContent>
            {brands.map((brand) => <SelectItem key={brand.id} value={brand.slug}>{brand.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input type="number" placeholder="Min price" defaultValue={searchParams.get("minPrice") ?? ""} onBlur={(event) => updateParam("minPrice", event.target.value)} />
          <Input type="number" placeholder="Max price" defaultValue={searchParams.get("maxPrice") ?? ""} onBlur={(event) => updateParam("maxPrice", event.target.value)} />
        </div>
        <Button variant="secondary" className="w-full" onClick={() => router.push("/products")}>
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
