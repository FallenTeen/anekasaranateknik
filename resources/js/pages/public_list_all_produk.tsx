import FooterSection from '@/components/landingpage/Footer';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShop } from '@/context/ShopContext';
import { Head, Link } from '@inertiajs/react';
import { Heart, Search, ShoppingCart, Star, Loader2 } from 'lucide-react';
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
    searchQuery?: string;
    favorites?: number[];
    cartCount?: number;
}

export default function PublicListAllProducts({ 
    products, 
    categories, 
    searchQuery = '', 
    favorites = [], 
    cartCount = 0 
}: Props) {
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { isFavorite, toggleFavorite, addToCart, isLoading } = useShop();
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
    
    useEffect(() => {
    }, [favorites, cartCount]);
    
    useEffect(() => {
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = products.filter((product) => {
            const matchSearch =
                searchTerm === '' ||
                product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.deskripsi && product.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.kategori && product.kategori.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchCategory = selectedCategory === 'all' || product.kategori === selectedCategory;

            return matchSearch && matchCategory;
        });

        filtered.sort((a, b) => {
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

        return filtered;
    }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm.trim()) {
            params.append('q', searchTerm.trim());
        }
        window.location.href = `/public/products/search?${params.toString()}`;
    };

    const handleAddToCart = async (product: Product) => {
        const stockQuantity = product.stok;
        
        if (stockQuantity === 0 || isLoading) return;

        setLoadingProductId(product.id);

        try {
            await addToCart(product, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setLoadingProductId(null);
        }
    };

    const handleToggleFavorite = async (productId: number) => {
        if (isLoading) return;
        
        try {
            await toggleFavorite(productId);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <NavigationComponent />
            <Head title="Semua Produk - PT. Aneka Sarana Teknik" />

            <div className="min-h-screen bg-gray-50 ">
                <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        <div className="lg:col-span-1">
                            <div className="sticky h-screen top-[20%] z-10">
                                <Card>
                                    <CardContent className="p-6">
                                        <h2 className="mb-4 text-lg font-semibold">Filter & Pencarian</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Cari Produk</label>
                                                <div className="relative">
                                                    <Input
                                                        type="text"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                        placeholder="Cari produk..."
                                                        className="pr-10"
                                                    />
                                                    <button 
                                                        onClick={handleSearch} 
                                                        className="absolute top-1/2 right-2 -translate-y-1/2 transform p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Search className="h-4 w-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Kategori</label>
                                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Semua Kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

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
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="lg:col-span-3 mt-32">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Semua Produk'}
                                    </h2>
                                    <p className="text-gray-600">{filteredProducts.length} produk ditemukan</p>
                                </div>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">Tidak ada produk ditemukan</h3>
                                        <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredProducts.map((product) => {
                                        const stockQuantity = product.stok;
                                        const isOutOfStock = stockQuantity === 0;
                                        const isProductLoading = loadingProductId === product.id;

                                        return (
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
                                                            {product.diskon > 0 && (
                                                                <Badge variant="destructive">-{product.diskon}%</Badge>
                                                            )}
                                                            {isOutOfStock && (
                                                                <Badge variant="destructive">Stok Habis</Badge>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleToggleFavorite(product.id)}
                                                            disabled={isLoading}
                                                            className="bg-opacity-90 hover:bg-opacity-100 absolute top-3 right-3 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
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
                                                        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                                                            {product.nama_barang}
                                                        </h3>

                                                        <div className="mb-3 flex items-center">
                                                            <div className="flex items-center rounded-lg bg-yellow-50 px-2 py-1">
                                                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                                                <span className="ml-1 text-sm font-semibold text-yellow-700">
                                                                    {product.average_rating?.toFixed(1)}
                                                                </span>
                                                            </div>
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                ({product.feedbacks_count})
                                                            </span>
                                                        </div>

                                                        {product.kategori && (
                                                            <Badge variant="outline" className="mb-3">
                                                                {product.kategori}
                                                            </Badge>
                                                        )}

                                                        <div className="mb-4">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <span className="text-xl font-bold text-blue-600">
                                                                    {formatCurrency(product.harga_setelah_diskon)}
                                                                </span>
                                                            </div>
                                                            {product.diskon > 0 && (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        {formatCurrency(product.harga_jual)}
                                                                    </span>
                                                                    <span className="text-sm text-green-600 font-medium">
                                                                        Hemat {formatCurrency(product.harga_jual - product.harga_setelah_diskon)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mb-4">
                                                            <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-gray-600'}`}>
                                                                {isOutOfStock ? 'Stok habis' : `Stok: ${product.stok} tersedia`}
                                                            </span>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Link href={`/public/products/${product.id}`} className="flex-1">
                                                                <Button variant="outline" className="w-full">
                                                                    Detail
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                className="flex-1"
                                                                onClick={() => handleAddToCart(product)}
                                                                disabled={isOutOfStock || isProductLoading || isLoading}
                                                            >
                                                                {isProductLoading ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                                )}
                                                                {isProductLoading ? 'Menambah...' : isOutOfStock ? 'Habis' : 'Beli'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FooterSection />
        </>
    );
}