"use client";
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Leaf, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { categories, problems } from "../lib/constants"
import { useGetProductsQuery } from '@/redux/slices/cmsSlice';
import BestSellers from './BestSellers';
import ProductCard from './ProductsCard';
import { useSearchParams } from 'next/navigation';
import { useGetProductsHeroQuery } from '@/redux/slices/cmsSlice';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const ProductsPageContent = () => {
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';

    const [activeCategory, setActiveCategory] = useState(urlCategory);
    const [activeProblem, setActiveProblem] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const { data: heroData } = useGetProductsHeroQuery();
    const desktopHeroImage = heroData?.image
        ? (heroData.image.startsWith('http') ? heroData.image : `${API_BASE_URL}${heroData.image}`)
        : "/Our Products Banner.webp"; // fallback
    const hasMobileBanner = Boolean(heroData?.mobileImage);
    const mobileHeroImage = hasMobileBanner
        ? (heroData.mobileImage.startsWith('http') ? heroData.mobileImage : `${API_BASE_URL}${heroData.mobileImage}`)
        : desktopHeroImage;
    // console.log("Hero Image URL:", heroImage);
    // Update local states if URL params change
    useEffect(() => {
        setSearchQuery(urlSearch);
        setActiveCategory(urlCategory);
    }, [urlSearch, urlCategory]);

    // Price filter state
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [isPriceExpanded, setIsPriceExpanded] = useState(true);

    const { data, isLoading, isError } = useGetProductsQuery({
        category: activeCategory !== "all" ? activeCategory : undefined, limit: 100 , isActive: true
    });

    // Transform products to add full image URLs
    const products = useMemo(() => {
        const rawProducts = (data?.data ?? []).filter(p => p.isActive);
        return rawProducts.map(product => {
            const fullImageUrl = product.image?.startsWith('http')
                ? product.image
                : `${API_BASE_URL}${product.image}`;

            return {
                ...product,
                id: product._id || product.id,
                image: fullImageUrl,
                displayPrice: product.salePrice || product.price,
                mrp: product.price,
                price: product.salePrice || product.price,
                badge: product.isBestSeller ? 'Bestseller' : (product.isNewArrival ? 'New' : null)
            };
        });
    }, [data?.data]);

    const priceRangeOptions = [
        { id: 'under200', label: 'Under ₹200', min: 0, max: 200 },
        { id: '200-500', label: '₹200 - ₹500', min: 200, max: 500 },
        { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
        { id: '1000-5000', label: '₹1000 - ₹5000', min: 1000, max: 5000 },
        { id: 'above5000', label: 'Above ₹5000', min: 5000, max: 100000 }
    ];

    const filteredProducts = useMemo(() => {
        let filtered = activeCategory === "all"
            ? products
            : products.filter(p => {
                const productCategory = p.category || 'uncategorized';
                return productCategory === activeCategory;
            });

        // Apply price filter
        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(p => {
                return selectedPriceRanges.some(rangeId => {
                    const range = priceRangeOptions.find(r => r.id === rangeId);
                    const productPrice = p.displayPrice;
                    return productPrice >= range.min && productPrice <= range.max;
                });
            });
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [activeCategory, selectedPriceRanges, products, searchQuery]);

    useEffect(() => {
        setVisibleCount(5);
    }, [activeCategory, selectedPriceRanges, searchQuery]);

    const togglePriceRange = (rangeId) => {
        setSelectedPriceRanges(prev =>
            prev.includes(rangeId)
                ? prev.filter(id => id !== rangeId)
                : [...prev, rangeId]
        );
    };

    const clearFilters = () => {
        setSelectedPriceRanges([]);
        setActiveCategory('all');
        setSearchQuery('');
    };

    const bestSellers = useMemo(() => {
        return products.filter(p => p.isBestSeller);
    }, [products]);

    // Debug logging
    // useEffect(() => {
    //     // console.log('Raw data:', data);
    //     // console.log('Transformed products:', products);
    //     // console.log('Filtered products:', filteredProducts);
    // }, [data, products, filteredProducts]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading products…</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Failed to load products</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <section
                className={`relative w-full overflow-hidden ${
                    hasMobileBanner
                        ? 'aspect-[9/16] md:aspect-auto md:min-h-[360px] flex items-center justify-center p-0 md:pt-24 md:pb-24 md:px-4'
                        : 'min-h-[280px] md:min-h-[360px] flex items-center justify-center pt-36 pb-16 md:pt-24 md:pb-24 px-4'
                }`}
            >
                {/* Responsive Background Banner */}
                <picture key={`${desktopHeroImage}-${mobileHeroImage}`} className="absolute inset-0 w-full h-full">
                    {mobileHeroImage && (
                        <source
                            media="(max-width: 767px)"
                            srcSet={mobileHeroImage}
                        />
                    )}
                    <img
                        src={desktopHeroImage}
                        alt="Discover ARNA Products"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                </picture>

                {/* Dark overlay: shown on desktop, or on mobile when fallback desktop banner is used */}
                <div
                    className={`absolute inset-0 bg-black/35 z-10 ${hasMobileBanner ? 'hidden md:block' : ''}`}
                    aria-hidden="true"
                />

                {/* Text overlay: shown on desktop, or on mobile when fallback desktop banner is used */}
                <div
                    className={`relative max-w-7xl mx-auto text-center z-20 ${hasMobileBanner ? 'hidden md:block' : ''}`}
                >
                    <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-wider drop-shadow-2xl mb-4">
                        Discover ARNA Products
                    </h1>

                    <div className="mt-8 flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent"></div>
                    </div>
                </div>

                {/* Accessible H1 when mobile banner is active */}
                {hasMobileBanner && (
                    <h1 className="sr-only">Discover ARNA Products</h1>
                )}
            </section>


            {/* Mobile Filter Toggle Button */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A7A4E] text-white rounded-lg"
                >
                    <Menu className="w-5 h-5" />
                    <span className="font-medium">Filters</span>
                </button>
            </div>

            {/* Main Content Area with Sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-4 space-y-6">
                            {/* Categories Section */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-lg text-gray-800 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeCategory === cat.id
                                                ? 'bg-[#0A7A4E] text-white shadow-md'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter Section */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <button
                                    onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                                    className="w-full flex items-center justify-between mb-4"
                                >
                                    <h3 className="font-semibold text-lg text-gray-800">Price Range</h3>
                                    {isPriceExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                {isPriceExpanded && (
                                    <div className="space-y-3">
                                        {priceRangeOptions.map((range) => (
                                            <label
                                                key={range.id}
                                                className="flex items-center gap-3 cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPriceRanges.includes(range.id)}
                                                    onChange={() => togglePriceRange(range.id)}
                                                    className="w-4 h-4 text-[#0A7A4E] rounded border-gray-300 focus:ring-[#0A7A4E]"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-[#0A7A4E]">
                                                    {range.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Clear Filters */}
                            {(activeCategory !== 'all' || selectedPriceRanges.length > 0) && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div className="lg:hidden fixed inset-0 z-50">
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-semibold text-xl text-gray-800">Filters</h2>
                                        <button
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800 mb-4">Categories</h3>
                                        <div className="space-y-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setActiveCategory(cat.id);
                                                        setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeCategory === cat.id
                                                        ? 'bg-[#0A7A4E] text-white shadow-md'
                                                        : 'bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Filter */}
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800 mb-4">Price Range</h3>
                                        <div className="space-y-3">
                                            {priceRangeOptions.map((range) => (
                                                <label
                                                    key={range.id}
                                                    className="flex items-center gap-3 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPriceRanges.includes(range.id)}
                                                        onChange={() => togglePriceRange(range.id)}
                                                        className="w-4 h-4 text-[#0A7A4E] rounded border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">{range.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    {(activeCategory !== 'all' || selectedPriceRanges.length > 0) && (
                                        <button
                                            onClick={() => {
                                                clearFilters();
                                                setIsSidebarOpen(false);
                                            }}
                                            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Products Grid */}
                    <div className="flex-1">
                        {/* Results Info */}
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-800">{Math.min(visibleCount, filteredProducts.length)}</span> of{' '}
                                <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
                                {searchQuery && (
                                    <span> for "<span className="font-semibold text-[#0A7A4E]">{searchQuery}</span>"</span>
                                )}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" /> Clear search
                                </button>
                            )}
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.slice(0, visibleCount).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-xl text-gray-600">No products found matching your filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-3 bg-[#0A7A4E] text-white rounded-lg hover:bg-[#0A7A4E]/90 cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Load More Button */}
                        {visibleCount < filteredProducts.length && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="px-6 py-3 rounded-full bg-[#0A7A4E] text-white font-medium hover:bg-[#0A7A4E]/90 transition-all shadow-md cursor-pointer"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Best Sellers Strip */}
            <BestSellers bestSellers={bestSellers} />

            {/* Skincare Problem Finder */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#0A7A4E] mb-4">
                        Find Solutions for Your Concerns
                    </h2>
                    <p className="text-gray-600">Select your skin or hair concern to discover the perfect products</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {problems.map((problem) => (
                        <button
                            key={problem.id}
                            onClick={() => setActiveProblem(problem.id)}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${activeProblem === problem.id
                                ? 'border-[#0A7A4E] bg-[#0A7A4E]/5 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-[#0A7A4E]/50'
                                }`}
                        >
                            <div className="text-4xl mb-3">{problem.icon}</div>
                            <div className="text-sm font-medium text-gray-800">{problem.label}</div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading products...</div>}>
            <ProductsPageContent />
        </Suspense>
    );
}