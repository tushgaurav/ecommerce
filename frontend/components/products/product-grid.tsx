'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';
import api from '@/lib/api';
import { Product, ApiResponse } from '@/types';
import { ProductFilters } from './product-filters'

export function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (sortBy) params.append('ordering', sortBy);

            const response = await api.get<ApiResponse<Product>>(`/products/?${params.toString()}`);
            setProducts(response.data.results || response.data as any);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-8">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-64 lg:mr-8 mb-8 lg:mb-0">
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="h-48 w-full rounded-xl" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="flex flex-col lg:flex-row">
                <ProductFilters />
                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-4">Products</h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Sort by Name</SelectItem>
                                    <SelectItem value="price">Price: Low to High</SelectItem>
                                    <SelectItem value="-price">Price: High to Low</SelectItem>
                                    <SelectItem value="-created_at">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {products.length === 0 && !loading && (
                        <div className="text-center text-muted-foreground mt-8">
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}