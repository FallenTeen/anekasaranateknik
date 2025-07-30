import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NavigationComponent from '@/components/landingpage/Navbar';
import FooterSection from '@/components/landingpage/Footer';
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  user_id: number;
  id_barang: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  barang: {
    id: number;
    nama_barang: string;
    kode_barang: string;
    gambar: string | null;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    stok: string;
    kategori: string | null;
    status_rekomendasi: boolean;
  };
}

interface Props {
  cartItems: CartItem[];
}

export default function PublicKeranjang({ cartItems }: Props) {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity);
    
    if (quantity < 1) return;

    setLoading(itemId);
    setError('');

    try {
      const response = await fetch(`/public/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ quantity: quantity })
      });

      const data = await response.json();

      if (response.ok) {
        setItems(prev => prev.map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        ));
        toast.success('Keranjang berhasil diupdate');
      } else {
        setError(data.error || 'Gagal mengupdate keranjang');
        toast.error(data.error || 'Gagal mengupdate keranjang');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat mengupdate keranjang';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
      return;
    }

    setLoading(itemId);
    setError('');

    try {
      const response = await fetch(`/public/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Item berhasil dihapus dari keranjang');
      } else {
        setError(data.error || 'Gagal menghapus item dari keranjang');
        toast.error(data.error || 'Gagal menghapus item dari keranjang');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat menghapus item';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
      return;
    }

    setLoading(0);
    setError('');

    try {
      const response = await fetch('/public/cart/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setItems([]);
        toast.success('Keranjang berhasil dikosongkan');
      } else {
        setError(data.error || 'Gagal mengosongkan keranjang');
        toast.error(data.error || 'Gagal mengosongkan keranjang');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat mengosongkan keranjang';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) =>
      total + (item.barang.harga_setelah_diskon * item.quantity), 0
    );
  };

  const calculateTotalSavings = () => {
    return items.reduce((total, item) =>
      total + ((item.barang.harga_jual - item.barang.harga_setelah_diskon) * item.quantity), 0
    );
  };

  const subtotal = calculateSubtotal();
  const totalSavings = calculateTotalSavings();
  const shippingCost = 0; 
  const total = subtotal + shippingCost;

  return (
    <>
      <NavigationComponent />
      <Head title="Keranjang Belanja - PT. Aneka Sarana Teknik" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/public/products">
                  <Button variant="ghost" className="text-white hover:bg-blue-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Lanjut Belanja
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Keranjang Belanja Kosong
                </h2>
                <p className="text-gray-600 mb-8">
                  Belum ada produk dalam keranjang Anda. Mari mulai berbelanja!
                </p>
                <Link href="/public/products">
                  <Button size="lg">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Mulai Belanja
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Items dalam Keranjang ({items.length})
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    disabled={loading === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Kosongkan Keranjang
                  </Button>
                </div>

                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.barang.gambar ? `/storage/${item.barang.gambar}` : "/api/placeholder/96/96"}
                            alt={item.barang.nama_barang}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {item.barang.nama_barang}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Kode: {item.barang.kode_barang}
                              </p>
                              {item.barang.kategori && (
                                <Badge variant="outline" className="mt-1">
                                  {item.barang.kategori}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              disabled={loading === item.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xl font-bold text-blue-600">
                              {formatCurrency(item.barang.harga_setelah_diskon)}
                            </span>
                            {item.barang.diskon > 0 && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatCurrency(item.barang.harga_jual)}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  -{item.barang.diskon}%
                                </Badge>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || loading === item.id}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  max={parseInt(item.barang.stok)}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                    if (newQty !== item.quantity) {
                                      updateQuantity(item.id, newQty);
                                    }
                                  }}
                                  className="w-16 h-8 text-center border-0 focus:ring-0"
                                  disabled={loading === item.id}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= parseInt(item.barang.stok) || loading === item.id}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <span className="text-sm text-gray-500">
                                Stok: {item.barang.stok}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatCurrency(item.barang.harga_setelah_diskon * item.quantity)}
                              </div>
                              {item.barang.diskon > 0 && (
                                <div className="text-sm text-green-600">
                                  Hemat {formatCurrency((item.barang.harga_jual - item.barang.harga_setelah_diskon) * item.quantity)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ringkasan Pesanan
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal ({items.length} item)</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Hemat</span>
                          <span className="font-medium text-green-600">
                            -{formatCurrency(totalSavings)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ongkos Kirim</span>
                        <span className="font-medium text-green-600">
                          {shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost)}
                        </span>
                      </div>

                      <hr className="my-4" />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Lanjut ke Pembayaran
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </>
  );
}