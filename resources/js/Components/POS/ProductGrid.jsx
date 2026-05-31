import React from "react";
import { IconShoppingBag, IconPhoto, IconMinus, IconPlus } from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatPrice = (value = 0) =>
    Number(value || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

// Single Product Card
function ProductCard({ product, onAddToCart, isAdding }) {
    const hasStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;
    const promoBadge = product.pricing_badge;
    const promoPrice = Number(promoBadge?.promo_price || 0);
    const basePrice = Number(promoBadge?.base_price || product.sell_price || 0);
    const showPromo = promoBadge && promoPrice > 0 && promoPrice < basePrice;
    const showBadge = Boolean(promoBadge?.label);

    return (
        <button
            onClick={() => hasStock && onAddToCart(product)}
            disabled={!hasStock || isAdding}
            className={`group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
                hasStock
                    ? "cursor-pointer hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg active:scale-[0.98] dark:hover:border-primary-700"
                    : "cursor-not-allowed opacity-60"
            } `}
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                {product.image ? (
                    <img
                        src={getProductImageUrl(product.image)}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <IconPhoto size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                )}

                {/* Stock Badge */}
                {lowStock && (
                    <span className="absolute right-2 top-2 rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-900/50 dark:text-warning-400">
                        Sisa {product.stock}
                    </span>
                )}

                {showBadge && (
                    <span className="absolute left-2 top-2 max-w-[70%] truncate rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-lg">
                        {promoBadge.label}
                    </span>
                )}

                {/* Out of Stock Overlay */}
                {!hasStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                        <span className="rounded-full bg-danger-500 px-3 py-1 text-xs font-semibold text-white">
                            Habis
                        </span>
                    </div>
                )}

                {/* Hover Add Indicator (centered on image) */}
                {hasStock && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-500/10 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                            + Tambah
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex min-h-[80px] flex-1 flex-col justify-between p-3 text-left">
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-primary-600 dark:text-slate-200 dark:group-hover:text-primary-400">
                    {product.title}
                </h3>
                <div className="mt-2">
                    {showPromo && (
                        <p className="text-xs text-slate-400 line-through">
                            {formatPrice(basePrice)}
                        </p>
                    )}
                    <p className="text-base font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(showPromo ? promoPrice : product.sell_price)}
                    </p>
                    {showBadge && !showPromo && (
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            Promo tersedia
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}

// Category Tab Button
function CategoryTab({ category, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`min-h-touch whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            } `}
        >
            {category.name}
        </button>
    );
}

// Search Input
function SearchInput({ value, onChange, onSearch, isSearching, placeholder, inputRef }) {
    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                placeholder={placeholder || "Cari produk atau scan barcode... (/ untuk fokus)"}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 text-base text-slate-800 placeholder-slate-400 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-primary-500"
                disabled={isSearching}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                ) : (
                    <IconShoppingBag size={20} className="text-slate-400" />
                )}
            </div>
        </div>
    );
}

// Main ProductGrid Component
export default function ProductGrid({
    products = [],
    categories = [],
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    onSearch,
    isSearching,
    onAddToCart,
    addingProductId,
    searchInputRef,
}) {
    const normalizedSelectedCategory = selectedCategory === null ? null : Number(selectedCategory);

    // Filter products by category and search
    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            normalizedSelectedCategory === null ||
            Number(product.category_id) === normalizedSelectedCategory;
        const matchesSearch =
            !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-full flex-col">
            {/* Search Bar */}
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    onSearch={onSearch}
                    isSearching={isSearching}
                    placeholder="Cari produk atau scan barcode... (tekan / untuk fokus)"
                    inputRef={searchInputRef}
                />
            </div>

            {/* Category Tabs */}
            <div className="scrollbar-hide overflow-x-auto border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div className="flex gap-2">
                    <CategoryTab
                        category={{ id: null, name: "Semua" }}
                        isActive={normalizedSelectedCategory === null}
                        onClick={() => onCategoryChange(null)}
                    />
                    {categories.map((category) => (
                        <CategoryTab
                            key={category.id}
                            category={category}
                            isActive={normalizedSelectedCategory === Number(category.id)}
                            onClick={() => onCategoryChange(Number(category.id))}
                        />
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                isAdding={addingProductId === product.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <IconShoppingBag size={48} strokeWidth={1.5} className="mb-3" />
                        <p className="text-sm">
                            {searchQuery ? "Produk tidak ditemukan" : "Tidak ada produk"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export sub-components
ProductGrid.Card = ProductCard;
ProductGrid.CategoryTab = CategoryTab;
ProductGrid.SearchInput = SearchInput;
