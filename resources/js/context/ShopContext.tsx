import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Product {
    id: number;
    nama_barang: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    gambar: string;
    deskripsi?: string;
    stok: number;
    kategori: string;
    average_rating?: number;
    feedbacks_count?: number;
    status_rekomendasi?: boolean;
}

interface ShopContextType {
    favorites: Set<number>;
    favoritesCount: number;
    cartCount: number;
    isLoading: boolean;
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (productId: number) => Promise<void>;
    addToCart: (product: Product, quantity: number) => Promise<void>;
    refreshData: () => Promise<void>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    testContext: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
    children: React.ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getCSRFToken = (): string => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' : type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }, []);

    const isFavorite = useCallback(
        (productId: number): boolean => {
            return favorites.has(productId);
        },
        [favorites],
    );

    // ShopContext.tsx
    const refreshData = useCallback(async () => {
        try {
            // Get cart count
            const cartResponse = await fetch('/public/cart/count');
            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                setCartCount(cartData.cartCount || 0);
            }

            // Get favorites
            const favResponse = await fetch('/public/products/favorites');
            if (favResponse.ok) {
                const favData = await favResponse.json();
                setFavorites(new Set(favData.favorites || []));
                setFavoritesCount(favData.favoritesCount || 0);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }, []);
    const toggleFavorite = useCallback(
        async (productId: number) => {
            if (isLoading) return;

            setIsLoading(true);
            console.log('Toggling favorite for product:', productId);

            try {
                const response = await fetch('/public/products/toggle-favorite', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ product_id: productId }),
                });

                const data = await response.json();
                console.log('Toggle favorite response:', data);

                if (response.ok && data.success) {
                    const newFavorites = new Set(favorites);

                    if (data.isLiked) {
                        newFavorites.add(productId);
                        console.log('Added to favorites:', productId);
                    } else {
                        newFavorites.delete(productId);
                        console.log('Removed from favorites:', productId);
                    }

                    setFavorites(newFavorites);
                    setFavoritesCount(data.favoritesCount || 0);
                    setCartCount(data.cartCount || 0);

                    showToast(data.message, 'success');

                    // Force a refresh of the navbar data
                    setTimeout(() => {
                        refreshData();
                    }, 100);
                } else {
                    const errorMessage = data.error || 'Gagal mengubah status favorit';
                    console.error('Toggle favorite error:', errorMessage);
                    showToast(errorMessage, 'error');

                    if (response.status === 401) {
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
                showToast('Terjadi kesalahan sistem', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [favorites, isLoading, showToast, refreshData],
    );

    const addToCart = useCallback(
        async (product: Product, quantity: number) => {
            if (isLoading) return;

            setIsLoading(true);

            try {
                const response = await fetch('/public/cart/add', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCSRFToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: quantity,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setCartCount(data.cartCount || 0);
                    showToast(data.message || 'Produk ditambahkan ke keranjang', 'success');
                } else {
                    const errorMessage = data.error || 'Gagal menambahkan ke keranjang';
                    showToast(errorMessage, 'error');

                    if (response.status === 401) {
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showToast('Terjadi kesalahan sistem', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, showToast],
    );

    // Initialize data on mount
    useEffect(() => {
        console.log('ShopContext: Initializing...');
        refreshData();
    }, [refreshData]);

    // Test function to verify context is working
    const testContext = useCallback(() => {
        console.log('ShopContext: Current state:', {
            favorites: Array.from(favorites),
            favoritesCount,
            cartCount,
            isLoading,
        });
    }, [favorites, favoritesCount, cartCount, isLoading]);

    const value: ShopContextType = {
        favorites,
        favoritesCount,
        cartCount,
        isLoading,
        isFavorite,
        toggleFavorite,
        addToCart,
        refreshData,
        showToast,
        testContext,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
