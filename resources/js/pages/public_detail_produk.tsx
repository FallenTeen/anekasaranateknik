import FooterSection from '@/components/landingpage/Footer';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye, Heart, Share2, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner'; // Add this import for toast notifications

interface Product {
    id: number;
    nama_barang: string;
    kode_barang: string;
    deskripsi: string | null;
    gambar: string | null;
    gambar_deskripsi: Array<{ url: string; caption?: string }> | null;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    kategori: string | null;
    stok: string;
    average_rating: number;
    feedbacks_count: number;
    total_likes: number;
    status_rekomendasi: boolean;
}

interface RelatedProduct {
    id: number;
    nama_barang: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    gambar: string | null;
    average_rating: number;
    feedbacks_count: number;
    status_rekomendasi: boolean;
}

interface Props {
    product: Product;
    relatedProducts: RelatedProduct[];
    favorites: number[];
    cartCount: number;
}

export default function PublicDetailProduct({ product, relatedProducts, favorites, cartCount }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { isFavorite, toggleFavorite, addToCart } = useShop();
    const [quantity, setQuantity] = useState(1); // Fixed: Default to 1 instead of 0
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const allImages = [product.gambar, ...(product.gambar_deskripsi?.map((img) => img.url) || [])].filter(Boolean);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleAddToCart = async () => {
        if (quantity < 1 || parseInt(product.stok) === 0 || isAddingToCart) return;

        setIsAddingToCart(true);
        
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
                // Success toast
                toast.success(data.message || 'Produk berhasil ditambahkan ke keranjang!', {
                    description: `${quantity} ${product.nama_barang} ditambahkan ke keranjang`,
                });
                
                // Update cart using context if available
                addToCart(
                    {
                        id: product.id,
                        nama_barang: product.nama_barang,
                        harga_jual: product.harga_jual,
                        harga_setelah_diskon: product.harga_setelah_diskon,
                        diskon: product.diskon,
                        gambar: product.gambar,
                        stok: product.stok,
                        kategori: product.kategori || null,
                        status_rekomendasi: product.status_rekomendasi || false,
                    },
                    quantity,
                );
            } else {
                // Error toast
                toast.error(data.error || 'Gagal menambahkan produk ke keranjang');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Terjadi kesalahan saat menambahkan ke keranjang');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (isTogglingFavorite) return;
        
        setIsTogglingFavorite(true);
        
        try {
            const response = await fetch('/public/products/toggle-favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: product.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success toast
                toast.success(data.message, {
                    description: data.isLiked ? 'Produk ditambahkan ke favorit' : 'Produk dihapus dari favorit',
                });
                
                // Update favorite using context
                toggleFavorite(product.id);
            } else {
                // Error toast
                toast.error(data.error || 'Gagal mengubah status favorit');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Terjadi kesalahan saat mengubah favorit');
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    return (
        <>
            <NavigationComponent />
            <Head title={`${product.nama_barang} - PT. Aneka Sarana Teknik`} />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 py-4 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <Link href="/public/products">
                                <Button variant="ghost" className="text-white hover:bg-blue-700">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Produk
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div>
                            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                                <img
                                    src={allImages[selectedImage] ? `/storage/${allImages[selectedImage]}` : '/api/placeholder/500/400'}
                                    alt={product.nama_barang}
                                    className="h-96 w-full object-cover"
                                />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.status_rekomendasi && <Badge className="bg-blue-600 text-white">⭐ Rekomendasi</Badge>}
                                    {product.diskon > 0 && <Badge variant="destructive">-{product.diskon}%</Badge>}
                                </div>
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isTogglingFavorite}
                                    className="bg-opacity-90 hover:bg-opacity-100 absolute top-4 right-4 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                >
                                    <Heart
                                        className={`h-5 w-5 transition-colors ${
                                            isFavorite(product.id) ? 'fill-current text-red-500' : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    />
                                </button>
                            </div>

                            {allImages.length > 1 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                                selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image}`}
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

                                <div className="mb-4 flex items-center">
                                    <div className="flex items-center rounded-lg bg-yellow-50 px-3 py-2">
                                        <Star className="h-5 w-5 fill-current text-yellow-500" />
                                        <span className="ml-2 text-lg font-semibold text-yellow-700">{product.average_rating.toFixed(1)}</span>
                                    </div>
                                    <span className="ml-3 text-gray-600">({product.feedbacks_count} ulasan)</span>
                                    <span className="ml-3 text-gray-600">• {product.total_likes} disukai</span>
                                </div>

                                {product.kategori && (
                                    <Badge variant="outline" className="mb-4">
                                        {product.kategori}
                                    </Badge>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="text-3xl font-bold text-blue-600">{formatCurrency(product.harga_setelah_diskon)}</span>
                                        {product.diskon > 0 && (
                                            <span className="text-xl text-gray-400 line-through">{formatCurrency(product.harga_jual)}</span>
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
                                        <Input
                                            type="number"
                                            min="1"
                                            max={parseInt(product.stok)}
                                            value={quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 1;
                                                setQuantity(Math.max(1, Math.min(value, parseInt(product.stok))));
                                            }}
                                            className="w-20"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600">Stok: {product.stok} tersedia</span>
                                </div>

                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleAddToCart} 
                                        disabled={parseInt(product.stok) === 0 || isAddingToCart} 
                                        className="flex-1"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        {isAddingToCart ? 'Menambahkan...' : parseInt(product.stok) === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                    </Button>
                                    <Button variant="outline">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {product.deskripsi && (
                                <div className="border-t pt-6">
                                    <h3 className="mb-3 text-lg font-semibold">Deskripsi Produk</h3>
                                    <p className="leading-relaxed whitespace-pre-line text-gray-700">{product.deskripsi}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="border-t pt-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Produk Terkait</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <Card key={relatedProduct.id} className="group transition-all duration-300 hover:shadow-lg">
                                        <CardContent className="p-0">
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={relatedProduct.gambar ? `/storage/${relatedProduct.gambar}` : '/api/placeholder/300/200'}
                                                    alt={relatedProduct.nama_barang}
                                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    {relatedProduct.status_rekomendasi && (
                                                        <Badge className="bg-blue-600 text-xs text-white">⭐ Rekomendasi</Badge>
                                                    )}
                                                    {relatedProduct.diskon > 0 && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            -{relatedProduct.diskon}%
                                                        </Badge>
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
                                                <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">{relatedProduct.nama_barang}</h3>

                                                <div className="mb-3 flex items-center">
                                                    <div className="flex items-center rounded-lg bg-yellow-50 px-2 py-1">
                                                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                        <span className="ml-1 text-sm font-semibold text-yellow-700">
                                                            {relatedProduct.average_rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                    <span className="ml-2 text-sm text-gray-500">({relatedProduct.feedbacks_count})</span>
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

                                                <Link href={`/public/products/${relatedProduct.id}`} className="block">
                                                    <Button variant="outline" className="w-full">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FooterSection />
        </>
    );
}