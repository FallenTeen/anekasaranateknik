import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: number;
  nama_barang: string;
  harga_jual: number;
  harga_setelah_diskon: number;
  diskon: number;
  gambar: string | null;
  deskripsi: string | null;
  kategori: string | null;
  stok: string;
  average_rating: number;
  feedbacks_count: number;
  total_likes: number;
  status_rekomendasi: boolean;
}

interface Props {
  products: Product[];
  categories: string[];
  currentCategory: string;
}

export default function PublicListByCategory({ products, categories, currentCategory }: Props) {
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState(new Set<number>());

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

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
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
      <Head title={`${currentCategory} - PT. Aneka Sarana Teknik`} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Link href="/public/products">
                <Button variant="ghost" className="text-white hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Semua Produk
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Kategori: {currentCategory}</h1>
              <p className="text-xl opacity-90">Temukan produk {currentCategory} berkualitas dengan harga terbaik</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Filter & Urutkan</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Urutkan</label>
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
                      <label className="block text-sm font-medium mb-2">Urutan</label>
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
                      <label className="block text-sm font-medium mb-2">Kategori Lainnya</label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <Link
                            key={category}
                            href={`/public/products/category/${encodeURIComponent(category)}`}
                            className={`block p-2 rounded-lg text-sm transition-colors ${
                              category === currentCategory
                                ? 'bg-blue-100 text-blue-700 font-medium'
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
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Produk {currentCategory}
                  </h2>
                  <p className="text-gray-600">{sortedProducts.length} produk ditemukan</p>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk dalam kategori ini</h3>
                    <p className="text-gray-600">Coba pilih kategori lain atau lihat semua produk</p>
                    <Link href="/public/products" className="mt-4">
                      <Button>Lihat Semua Produk</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.gambar ? `/storage/${product.gambar}` : "/api/placeholder/300/200"}
                            alt={product.nama_barang}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.status_rekomendasi && (
                              <Badge className="bg-blue-600 text-white">
                                ⭐ Rekomendasi
                              </Badge>
                            )}
                            {product.diskon > 0 && (
                              <Badge variant="destructive">
                                -{product.diskon}%
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.nama_barang}
                          </h3>

                          <div className="flex items-center mb-3">
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="ml-1 text-sm font-semibold text-yellow-700">
                                {product.average_rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              ({product.feedbacks_count})
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
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
                            <Button className="flex-1">
                              <ShoppingCart className="w-4 h-4 mr-2" />
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
