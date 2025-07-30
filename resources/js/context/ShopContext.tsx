import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
    id: number;
    nama_barang: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    gambar: string | null;
    stok: string;
    kategori: string | null;
    status_rekomendasi: boolean;
}

interface ShopContextType {
    favorites: number[];
    cartCount: number;
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (productId: number) => Promise<void>;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [toasts, setToasts] = useState<Array<{
        id: number;
        message: string;
        type: 'success' | 'error' | 'info';
    }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load favorites
                const favResponse = await fetch('/api/user/favorites');
                if (favResponse.ok) {
                    const favData = await favResponse.json();
                    setFavorites(favData.favorites || []);
                }

                // Load cart count
                const cartResponse = await fetch('/public/cart/count');
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    setCartCount(cartData.cartCount || 0);
                }
            } catch (error) {
                console.error('Failed to load initial data:', error);
            }
        };

        loadInitialData();
    }, []);

    const isFavorite = (productId: number) => {
        return favorites.includes(productId);
    };

    const toggleFavorite = async (productId: number) => {
        try {
            const response = await fetch('/public/products/toggle-favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ product_id: productId })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.isLiked) {
                    setFavorites(prev => [...prev, productId]);
                    showToast('Produk ditambahkan ke favorit! ❤️', 'success');
                } else {
                    setFavorites(prev => prev.filter(id => id !== productId));
                    showToast('Produk dihapus dari favorit', 'info');
                }
                setCartCount(data.cartCount || 0);
            } else {
                if (response.status === 401) {
                    showToast('Silakan login terlebih dahulu', 'error');
                } else {
                    showToast(data.error || 'Gagal mengupdate favorit', 'error');
                }
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            showToast('Terjadi kesalahan. Silakan coba lagi', 'error');
        }
    };

    const addToCart = async (product: Product, quantity: number = 1) => {
        try {
            const response = await fetch('/public/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity
                })
            });

            const data = await response.json();

            if (response.ok) {
                setCartCount(data.cartCount || 0);
                showToast(`${product.nama_barang} berhasil ditambahkan ke keranjang! 🛒`, 'success');
            } else {
                if (response.status === 401) {
                    showToast('Silakan login terlebih dahulu', 'error');
                } else {
                    showToast(data.error || 'Gagal menambahkan ke keranjang', 'error');
                }
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            showToast('Terjadi kesalahan. Silakan coba lagi', 'error');
        }
    };

    return (
        <ShopContext.Provider value={{
            favorites,
            cartCount,
            isFavorite,
            toggleFavorite,
            addToCart,
            showToast
        }}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            max-w-sm px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
                            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
                            animate-in slide-in-from-right
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 text-white hover:text-gray-200 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ShopContext.Provider>
    );
}

export function useShop() {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}