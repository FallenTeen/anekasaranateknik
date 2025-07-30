import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, Heart, ShoppingCart, Share2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import NavigationComponent from '@/components/landingpage/Navbar';
import FooterSection from '@/components/landingpage/Footer';

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
}

export default function PublicDetailProduct({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState(new Set<number>());

  const allImages = [
    product.gambar,
    ...(product.gambar_deskripsi?.map(img => img.url) || [])
  ].filter(Boolean);

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

  const handleAddToCart = () => {
    if (quantity < 1) return;

    fetch('/public/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Produk berhasil ditambahkan ke keranjang!');
      } else {
        alert('Gagal menambahkan ke keranjang. Silakan login terlebih dahulu.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    });
  };

  return (
    <>
    <NavigationComponent/>
      <Head title={`${product.nama_barang} - PT. Aneka Sarana Teknik`} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Link href="/public/products">
                <Button variant="ghost" className="text-white hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                <img
                  src={allImages[selectedImage] ? `/storage/${allImages[selectedImage]}` : "/api/placeholder/500/400"}
                  alt={product.nama_barang}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
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
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={`/storage/${image}`}
                        alt={`${product.nama_barang} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.nama_barang}
                </h1>
                <p className="text-gray-600 mb-4">Kode: {product.kode_barang}</p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="ml-2 text-lg font-semibold text-yellow-700">
                      {product.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="ml-3 text-gray-600">
                    ({product.feedbacks_count} ulasan)
                  </span>
                  <span className="ml-3 text-gray-600">
                    • {product.total_likes} disukai
                  </span>
                </div>

                {product.kategori && (
                  <Badge variant="outline" className="mb-4">
                    {product.kategori}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
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
                    <p className="text-green-600 font-medium">
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
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    Stok: {product.stok} tersedia
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={parseInt(product.stok) === 0}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {parseInt(product.stok) === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {product.deskripsi && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Deskripsi Produk</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.deskripsi}
                  </p>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedProduct.gambar ? `/storage/${relatedProduct.gambar}` : "/api/placeholder/300/200"}
                          alt={relatedProduct.nama_barang}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {relatedProduct.status_rekomendasi && (
                            <Badge className="bg-blue-600 text-white text-xs">
                              ⭐ Rekomendasi
                            </Badge>
                          )}
                          {relatedProduct.diskon > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{relatedProduct.diskon}%
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => toggleFavorite(relatedProduct.id)}
                          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              favorites.has(relatedProduct.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedProduct.nama_barang}
                        </h3>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-semibold text-yellow-700">
                              {relatedProduct.average_rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            ({relatedProduct.feedbacks_count})
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
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
                            <Eye className="w-4 h-4 mr-2" />
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
    <FooterSection/>
    </>
  );
}
