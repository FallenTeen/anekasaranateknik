import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, CreditCard, AlertCircle, MapPin, User, Phone, Mail, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FooterSection from '@/components/landingpage/Footer';
import { useShop } from '@/context/ShopContext';

interface CartItem {
  id: number;
  user_id: number;
  barang_id: number;
  jumlah: number;
  created_at: string;
  updated_at: string;
  barang: {
    id: number;
    nama_barang: string;
    kode_barang: string;
    gambar: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    stok: number;
    kategori: string;
    status_rekomendasi: boolean;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Props {
  cartItems: CartItem[];
  favorites?: number[];
  cartCount?: number;
  user?: User;
}

export default function PublicKeranjang({ cartItems, favorites = [], cartCount = 0, user }: Props) {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { showToast, refreshData } = useShop();

  const { data, setData, post, processing, errors } = useForm({
    metode_pembayaran: '',
    alamat_pengiriman: user?.address || '',
    nama_lengkap: user?.name || '',
    nomor_telepon: user?.phone || '',
    email: user?.email || '',
    catatan: ''
  });

  useEffect(() => {
  }, [favorites, cartCount]);

  useEffect(() => {
  }, [cartItems]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCSRFToken = (): string => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token || '';
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    const quantity = Math.max(1, Math.floor(newQuantity));

    if (quantity < 1) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const maxStock = item.barang.stok;
    if (quantity > maxStock) {
      showToast(`Maksimal ${maxStock} item tersedia`, 'error');
      return;
    }

    setLoading(itemId);
    setError('');

    try {
      const response = await fetch(`/public/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ quantity: quantity })
      });

      const data = await response.json();

      if (response.ok) {
        setItems(prev => prev.map(item =>
          item.id === itemId ? { ...item, jumlah: quantity } : item
        ));
        showToast('Keranjang berhasil diupdate', 'success');
        await refreshData();
      } else {
        const errorMessage = data.error || 'Gagal mengupdate keranjang';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat mengupdate keranjang';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(null);
    }
  };

  const removeItem = async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (!confirm(`Hapus ${item.barang.nama_barang} dari keranjang?`)) {
      return;
    }

    setLoading(itemId);
    setError('');

    try {
      const response = await fetch(`/public/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        showToast('Item berhasil dihapus dari keranjang', 'success');
        await refreshData();
      } else {
        const errorMessage = data.error || 'Gagal menghapus item dari keranjang';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat menghapus item';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Yakin ingin mengosongkan seluruh keranjang?')) {
      return;
    }

    setLoading(0);
    setError('');

    try {
      const response = await fetch('/public/cart/clear', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setItems([]);
        showToast('Keranjang berhasil dikosongkan', 'success');
        await refreshData();
      } else {
        const errorMessage = data.error || 'Gagal mengosongkan keranjang';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      const errorMessage = 'Terjadi kesalahan saat mengosongkan keranjang';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(null);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) =>
      total + (item.barang.harga_setelah_diskon * item.jumlah), 0
    );
  };

  const calculateTotalSavings = () => {
    return items.reduce((total, item) =>
      total + ((item.barang.harga_jual - item.barang.harga_setelah_diskon) * item.jumlah), 0
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast('Keranjang masih kosong', 'error');
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.metode_pembayaran) {
      showToast('Silakan pilih metode pembayaran', 'error');
      return;
    }

    if (!data.alamat_pengiriman.trim()) {
      showToast('Silakan isi alamat pengiriman', 'error');
      return;
    }

    post('/public/checkout', {
      onSuccess: () => {
        showToast('Pesanan berhasil dibuat', 'success');
      },
      onError: (errors) => {
        console.error('Checkout errors:', errors);
        const errorMessage = Object.values(errors)[0] as string || 'Terjadi kesalahan saat membuat pesanan';
        showToast(errorMessage, 'error');
      }
    });
  };

  const subtotal = calculateSubtotal();
  const totalSavings = calculateTotalSavings();
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  return (
    <>
      <NavigationComponent />
      <Head title="Keranjang Belanja - PT. Aneka Sarana Teknik" />

      <div className="min-h-screen bg-gray-50 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
            <Link href="/public/transactions">
              <Button variant="outline" className="bg-white hover:bg-gray-100">
                <History className="w-4 h-4 mr-2" />
                Riwayat Transaksi
              </Button>
            </Link>
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
          {items.length === 0 && !showCheckoutForm ? (
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
                {!showCheckoutForm ? (
                  <>
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
                                src={item.barang.gambar ? `/assets/images/${item.barang.gambar}` : "/api/placeholder/96/96"}
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
                                      onClick={() => updateQuantity(item.id, item.jumlah - 1)}
                                      disabled={item.jumlah <= 1 || loading === item.id}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <Input
                                      type="number"
                                      min="1"
                                      max={item.barang.stok}
                                      value={item.jumlah}
                                      onChange={(e) => {
                                        const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                        if (newQty !== item.jumlah) {
                                          updateQuantity(item.id, newQty);
                                        }
                                      }}
                                      className="w-16 h-8 text-center border-0 focus:ring-0"
                                      disabled={loading === item.id}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.jumlah + 1)}
                                      disabled={item.jumlah >= item.barang.stok || loading === item.id}
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
                                    {formatCurrency(item.barang.harga_setelah_diskon * item.jumlah)}
                                  </div>
                                  {item.barang.diskon > 0 && (
                                    <div className="text-sm text-green-600">
                                      Hemat {formatCurrency((item.barang.harga_jual - item.barang.harga_setelah_diskon) * item.jumlah)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Informasi Checkout
                      </h2>
                      <Button
                        variant="outline"
                        onClick={() => setShowCheckoutForm(false)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Keranjang
                      </Button>
                    </div>

                    <form onSubmit={handleSubmitCheckout} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Informasi Pembeli
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                              <Input
                                id="nama_lengkap"
                                value={data.nama_lengkap}
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                className={errors.nama_lengkap ? 'border-red-500' : ''}
                                placeholder="Masukkan nama lengkap"
                              />
                              {errors.nama_lengkap && (
                                <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                              <Input
                                id="nomor_telepon"
                                value={data.nomor_telepon}
                                onChange={(e) => setData('nomor_telepon', e.target.value)}
                                className={errors.nomor_telepon ? 'border-red-500' : ''}
                                placeholder="Masukkan nomor telepon"
                              />
                              {errors.nomor_telepon && (
                                <p className="text-red-500 text-sm mt-1">{errors.nomor_telepon}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={data.email}
                              onChange={(e) => setData('email', e.target.value)}
                              className={errors.email ? 'border-red-500' : ''}
                              placeholder="Masukkan email"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Alamat Pengiriman
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="alamat_pengiriman">Alamat Lengkap</Label>
                              <Textarea
                                id="alamat_pengiriman"
                                value={data.alamat_pengiriman}
                                onChange={(e) => setData('alamat_pengiriman', e.target.value)}
                                className={errors.alamat_pengiriman ? 'border-red-500' : ''}
                                placeholder="Masukkan alamat lengkap untuk pengiriman"
                                rows={3}
                              />
                              {errors.alamat_pengiriman && (
                                <p className="text-red-500 text-sm mt-1">{errors.alamat_pengiriman}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="catatan">Catatan (Opsional)</Label>
                              <Textarea
                                id="catatan"
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan untuk pesanan"
                                rows={2}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Metode Pembayaran
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            value={data.metode_pembayaran}
                            onValueChange={(value) => setData('metode_pembayaran', value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="transfer_bank" id="transfer_bank" />
                              <Label htmlFor="transfer_bank">Transfer Bank</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="e_wallet" id="e_wallet" />
                              <Label htmlFor="e_wallet">E-Wallet (GoPay, OVO, Dana)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod">COD (Cash on Delivery)</Label>
                            </div>
                          </RadioGroup>
                          {errors.metode_pembayaran && (
                            <p className="text-red-500 text-sm mt-2">{errors.metode_pembayaran}</p>
                          )}
                        </CardContent>
                      </Card>
                    </form>
                  </div>
                )}
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

                    {!showCheckoutForm ? (
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Lanjut ke Pembayaran
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubmitCheckout}
                        disabled={processing}
                      >
                        {processing ? 'Memproses...' : 'Buat Pesanan'}
                      </Button>
                    )}

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
