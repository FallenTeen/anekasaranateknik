import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import NavigationComponent from '@/components/landingpage/Navbar';
import FooterSection from '@/components/landingpage/Footer';

interface Product {
    id: number;
    nama_barang: string;
    kode_barang: string;
    deskripsi: string;
    gambar: string;
    gambar_deskripsi: any[];
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    kategori: string;
    stok: number;
    status_rekomendasi: boolean;
    total_likes: number;
    average_rating: number;
    feedbacks_count: number;
}

interface RelatedProduct {
    id: number;
    nama_barang: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    gambar: string;
    kategori: string;
    stok: number;
    status_rekomendasi: boolean;
    total_likes: number;
    average_rating: number;
    feedbacks_count: number;
    deskripsi: string;
}

interface Props {
    product: Product;
    relatedProducts: RelatedProduct[];
    favorites: number[];
    cartCount: number;
}

export default function PublicDetailProduct({ product, relatedProducts, favorites = [], cartCount = 0 }: Props) {
    const { isFavorite, toggleFavorite, addToCart, isLoading, testContext } = useShop();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleTestContext = () => {
        testContext();
    };

    useEffect(() => {
    }, [favorites, cartCount]);

    useEffect(() => {
    }, [product, relatedProducts]);

    const allImages = [
        product.gambar, 
        ...(Array.isArray(product.gambar_deskripsi) ? product.gambar_deskripsi.map((img) => img.url) : [])
    ].filter(Boolean);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleAddToCart = async () => {
        const stockQuantity = product.stok;
        
        if (quantity < 1 || stockQuantity === 0 || isAddingToCart || isLoading) return;
        
        if (quantity > stockQuantity) {
            alert(`Stok tidak mencukupi. Maksimal ${stockQuantity} item tersedia.`);
            return;
        }

        setIsAddingToCart(true);

        try {
            await addToCart(
                {
                    id: product.id,
                    nama_barang: product.nama_barang,
                    harga_jual: product.harga_jual,
                    harga_setelah_diskon: product.harga_setelah_diskon,
                    diskon: product.diskon,
                    gambar: product.gambar,
                    stok: product.stok,
                    kategori: product.kategori,
                    status_rekomendasi: product.status_rekomendasi,
                },
                quantity,
            );
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (isTogglingFavorite || isLoading) return;

        setIsTogglingFavorite(true);

        try {
            await toggleFavorite(product.id);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        const maxStock = product.stok;
        const safeQuantity = Math.max(1, Math.min(value, maxStock));
        setQuantity(safeQuantity);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.nama_barang,
                    text: `Lihat produk ${product.nama_barang} di PT. Aneka Sarana Teknik`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
                navigator.clipboard.writeText(window.location.href);
                alert('Link produk telah disalin ke clipboard!');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link produk telah disalin ke clipboard!');
        }
    };

    const stockQuantity = product.stok;
    const isOutOfStock = stockQuantity === 0;

    return (
        <>
            <Head title={`${product.nama_barang} - PT. Aneka Sarana Teknik`} />
<NavigationComponent/>
            <div className="min-h-screen bg-gray-50 mt-32">

                <div className="mx-auto  px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div>
                            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                                <img
                                    src={allImages[currentImageIndex] ? `/assets/images/${allImages[currentImageIndex]}` : '/api/placeholder/500/400'}
                                    alt={product.nama_barang}
                                    className="h-96 w-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.status_rekomendasi && (
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">⭐ Rekomendasi</span>
                                    )}
                                    {product.diskon > 0 && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">-{product.diskon}%</span>
                                    )}
                                    {isOutOfStock && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">Stok Habis</span>
                                    )}
                                </div>
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isTogglingFavorite || isLoading}
                                    className="bg-opacity-90 hover:bg-opacity-100 absolute top-4 right-4 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                >
                                    <Heart
                                        className={`h-5 w-5 transition-colors ${
                                            isFavorite(product.id) 
                                                ? 'fill-current text-red-500' 
                                                : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    />
                                </button>
                            </div>

                            {allImages.length > 1 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                                currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/assets/images/${image}`}
                                                alt={`${product.nama_barang} ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.nama_barang}</h1>
                                <p className="mb-4 text-gray-600">Kode: {product.kode_barang}</p>

                                <div className="mb-4 flex items-center gap-4">
                                    <div className="flex items-center rounded-lg bg-yellow-50 px-3 py-2">
                                        <Star className="h-5 w-5 fill-current text-yellow-500" />
                                        <span className="ml-2 text-lg font-semibold text-yellow-700">
                                            {product.average_rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-gray-600">({product.feedbacks_count} ulasan)</span>
                                    <span className="text-gray-600">• {product.total_likes} disukai</span>
                                </div>

                                {product.kategori && (
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                                        {product.kategori}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(product.harga_setelah_diskon)}
                                        </span>
                                        {product.diskon > 0 && (
                                            <span className="text-xl text-gray-400 line-through">
                                                {formatCurrency(product.harga_jual)}
                                            </span>
                                        )}
                                    </div>
                                    {product.diskon > 0 && (
                                        <p className="font-medium text-green-600">
                                            Hemat {formatCurrency(product.harga_jual - product.harga_setelah_diskon)} ({product.diskon}%)
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Jumlah:</span>
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                            <button
                                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                disabled={quantity <= 1 || isOutOfStock}
                                                className="p-2 border-r border-gray-300 hover:bg-gray-100"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={stockQuantity}
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                disabled={isOutOfStock}
                                                className="w-12 text-center border-none outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(prev => Math.min(stockQuantity, prev + 1))}
                                                disabled={quantity >= stockQuantity || isOutOfStock}
                                                className="p-2 border-l border-gray-300 hover:bg-gray-100"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-gray-600'}`}>
                                        {isOutOfStock ? 'Stok habis' : `Stok: ${product.stok} tersedia`}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock || isAddingToCart || isLoading}
                                        className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        {isAddingToCart ? 'Menambahkan...' : isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                                    </button>
                                </div>
                            </div>
                            {product.deskripsi && (
                                <div className="border-t pt-6">
                                    <h3 className="mb-3 text-lg font-semibold">Deskripsi Produk</h3>
                                    <p className="leading-relaxed whitespace-pre-line text-gray-700">
                                        {product.deskripsi}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="border-t pt-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Produk Terkait</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <div key={relatedProduct.id} className="group transition-all duration-300 hover:shadow-lg">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={relatedProduct.gambar ? `/assets/images/${relatedProduct.gambar}` : '/api/placeholder/300/200'}
                                                alt={relatedProduct.nama_barang}
                                                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                {relatedProduct.status_rekomendasi && (
                                                    <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded-md">⭐ Rekomendasi</span>
                                                )}
                                                {relatedProduct.diskon > 0 && (
                                                    <span className="bg-red-600 text-xs text-white px-2 py-1 rounded-md">-{relatedProduct.diskon}%</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => toggleFavorite(relatedProduct.id)}
                                                className="bg-opacity-90 hover:bg-opacity-100 absolute top-3 right-3 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110"
                                            >
                                                <Heart
                                                    className={`h-4 w-4 transition-colors ${
                                                        isFavorite(relatedProduct.id)
                                                            ? 'fill-current text-red-500'
                                                            : 'text-gray-400 hover:text-red-500'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                                                {relatedProduct.nama_barang}
                                            </h3>

                                            <div className="mb-3 flex items-center">
                                                <div className="flex items-center rounded-lg bg-yellow-50 px-2 py-1">
                                                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                    <span className="ml-1 text-sm font-semibold text-yellow-700">
                                                        {relatedProduct.average_rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({relatedProduct.feedbacks_count})
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {formatCurrency(relatedProduct.harga_setelah_diskon)}
                                                    </span>
                                                </div>
                                                {relatedProduct.diskon > 0 && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {formatCurrency(relatedProduct.harga_jual)}
                                                    </span>
                                                )}
                                            </div>
                                            <button className="block w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FooterSection/>
        </>
    );
}