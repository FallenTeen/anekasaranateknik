import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShop } from '@/context/ShopContext';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

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
    total_likes: number;
    status_rekomendasi?: boolean;
}

interface Props {
    products: Product[];
    categories: string[];
    currentCategory: string;
    favorites: number[];
    cartCount: number;
}

export default function PublicListByCategory({ products, categories, currentCategory, favorites, cartCount }: Props) {
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const { isFavorite, toggleFavorite, addToCart } = useShop();

    // Remove the addProductsToCache call since it's no longer available
    useEffect(() => {
        // This effect is no longer needed since we removed the caching system
    }, [products]);

    const sortedProducts = useMemo(() => {
        const sorted = [...products];

        sorted.sort((a, b) => {
            let aValue: any = a[sortBy as keyof Product];
            let bValue: any = b[sortBy as keyof Product];

            if (aValue === null || bValue === null) {
                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return sortOrder === 'asc' ? -1 : 1;
                return sortOrder === 'asc' ? 1 : -1;
            }

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [products, sortBy, sortOrder]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title={`${currentCategory} - PT. Aneka Sarana Teknik`} />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 py-8 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center">
                            <Link href="/public/products">
                                <Button variant="ghost" className="text-white hover:bg-blue-700">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Semua Produk
                                </Button>
                            </Link>
                        </div>
                        <div className="text-center">
                            <h1 className="mb-4 text-4xl font-bold">Kategori: {currentCategory}</h1>
                            <p className="text-xl opacity-90">Temukan produk {currentCategory} berkualitas dengan harga terbaik</p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        <div className="lg:col-span-1">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="mb-4 text-lg font-semibold">Filter & Urutkan</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Urutkan</label>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="created_at">Terbaru</SelectItem>
                                                    <SelectItem value="nama_barang">Nama A-Z</SelectItem>
                                                    <SelectItem value="harga_setelah_diskon">Harga Terendah</SelectItem>
                                                    <SelectItem value="average_rating">Rating Tertinggi</SelectItem>
                                                    <SelectItem value="total_likes">Paling Disukai</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Urutan</label>
                                            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="desc">Menurun</SelectItem>
                                                    <SelectItem value="asc">Menaik</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Kategori Lainnya</label>
                                            <div className="space-y-2">
                                                {categories.map((category) => (
                                                    <Link
                                                        key={category}
                                                        href={`/public/products/category/${encodeURIComponent(category)}`}
                                                        className={`block rounded-lg p-2 text-sm transition-colors ${
                                                            category === currentCategory
                                                                ? 'bg-blue-100 font-medium text-blue-700'
                                                                : 'hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {category}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Produk {currentCategory}</h2>
                                    <p className="text-gray-600">{sortedProducts.length} produk ditemukan</p>
                                </div>
                            </div>

                            {sortedProducts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">Tidak ada produk dalam kategori ini</h3>
                                        <p className="text-gray-600">Coba pilih kategori lain atau lihat semua produk</p>
                                        <Link href="/public/products" className="mt-4">
                                            <Button>Lihat Semua Produk</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {sortedProducts.map((product) => (
                                        <Card key={product.id} className="group transition-all duration-300 hover:shadow-lg">
                                            <CardContent className="p-0">
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={product.gambar ? `/assets/images/${product.gambar}` : '/api/placeholder/300/200'}
                                                        alt={product.nama_barang}
                                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                        {product.status_rekomendasi && (
                                                            <Badge className="bg-blue-600 text-white">⭐ Rekomendasi</Badge>
                                                        )}
                                                        {product.diskon > 0 && <Badge variant="destructive">-{product.diskon}%</Badge>}
                                                    </div>
                                                    <button
                                                        onClick={() => toggleFavorite(product.id)}
                                                        className="bg-opacity-90 hover:bg-opacity-100 absolute top-3 right-3 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110"
                                                    >
                                                        <Heart
                                                            className={`h-4 w-4 transition-colors ${
                                                                isFavorite(product.id)
                                                                    ? 'fill-current text-red-500'
                                                                    : 'text-gray-400 hover:text-red-500'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">{product.nama_barang}</h3>

                                                    <div className="mb-3 flex items-center">
                                                        <div className="flex items-center rounded-lg bg-yellow-50 px-2 py-1">
                                                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                            <span className="ml-1 text-sm font-semibold text-yellow-700">
                                                                {product.average_rating?.toFixed(1) || '0.0'}
                                                            </span>
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-500">({product.feedbacks_count || 0})</span>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                {formatCurrency(product.harga_setelah_diskon)}
                                                            </span>
                                                        </div>
                                                        {product.diskon > 0 && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {formatCurrency(product.harga_jual)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link href={`/public/products/${product.id}`} className="flex-1">
                                                            <Button variant="outline" className="w-full">
                                                                Detail
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            className="flex-1"
                                                            onClick={() =>
                                                                addToCart(
                                                                    {
                                                                        id: product.id,
                                                                        nama_barang: product.nama_barang,
                                                                        harga_jual: product.harga_jual,
                                                                        harga_setelah_diskon: product.harga_setelah_diskon,
                                                                        diskon: product.diskon,
                                                                        gambar: product.gambar,
                                                                        stok: product.stok,
                                                                        kategori: product.kategori,
                                                                        status_rekomendasi: product.status_rekomendasi || false,
                                                                    },
                                                                    1,
                                                                )
                                                            }
                                                        >
                                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                                            Beli
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}