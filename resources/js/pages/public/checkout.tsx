import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, MapPin, User, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FooterSection from '@/components/landingpage/Footer';
import { useShop } from '@/context/ShopContext';

interface CartItem {
  id: number;
  jumlah: number;
  barang: {
    id: number;
    nama_barang: string;
    kode_barang: string;
    gambar: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    stok: number;
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
  subtotal: number;
  totalSavings: number;
  user: User;
}

export default function CheckoutPage({ cartItems, subtotal, totalSavings, user }: Props) {
  const { showToast } = useShop();

  const { data, setData, post, processing, errors } = useForm({
    metode_pembayaran: '',
    alamat_pengiriman: user?.address || '',
    nama_lengkap: user?.name || '',
    nomor_telepon: user?.phone || '',
    email: user?.email || '',
    catatan: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const total = subtotal;

  return (
    <>
      <NavigationComponent />
      <Head title="Checkout - PT. Aneka Sarana Teknik" />

      <div className="min-h-screen bg-gray-50 mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/public/cart">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Keranjang
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Checkout
                </h1>
                <p className="text-gray-600">
                  Konfirmasi pesanan dan informasi pengiriman
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitCheckout}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">

                {/* Customer Information */}
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
                        <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                        <Input
                          id="nama_lengkap"
                          value={data.nama_lengkap}
                          onChange={(e) => setData('nama_lengkap', e.target.value)}
                          className={errors.nama_lengkap ? 'border-red-500' : ''}
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                        {errors.nama_lengkap && (
                          <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
                        <Input
                          id="nomor_telepon"
                          value={data.nomor_telepon}
                          onChange={(e) => setData('nomor_telepon', e.target.value)}
                          className={errors.nomor_telepon ? 'border-red-500' : ''}
                          placeholder="Masukkan nomor telepon"
                          required
                        />
                        {errors.nomor_telepon && (
                          <p className="text-red-500 text-sm mt-1">{errors.nomor_telepon}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                        placeholder="Masukkan email"
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
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
                        <Label htmlFor="alamat_pengiriman">Alamat Lengkap *</Label>
                        <Textarea
                          id="alamat_pengiriman"
                          value={data.alamat_pengiriman}
                          onChange={(e) => setData('alamat_pengiriman', e.target.value)}
                          className={errors.alamat_pengiriman ? 'border-red-500' : ''}
                          placeholder="Masukkan alamat lengkap untuk pengiriman (termasuk nama jalan, RT/RW, kelurahan, kecamatan, kota, dan kode pos)"
                          rows={4}
                          required
                        />
                        {errors.alamat_pengiriman && (
                          <p className="text-red-500 text-sm mt-1">{errors.alamat_pengiriman}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="catatan">Catatan Pengiriman (Opsional)</Label>
                        <Textarea
                          id="catatan"
                          value={data.catatan}
                          onChange={(e) => setData('catatan', e.target.value)}
                          placeholder="Patokan rumah, instruksi khusus, atau catatan lainnya"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
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
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="transfer_bank" id="transfer_bank" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="transfer_bank" className="font-medium">Transfer Bank</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Transfer ke rekening bank yang telah disediakan. Bukti transfer wajib diupload.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="e_wallet" id="e_wallet" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="e_wallet" className="font-medium">E-Wallet</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Pembayaran melalui GoPay, OVO, Dana, atau dompet digital lainnya.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="cod" className="font-medium">COD (Cash on Delivery)</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Bayar tunai saat barang sampai di lokasi Anda.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                    {errors.metode_pembayaran && (
                      <p className="text-red-500 text-sm mt-2">{errors.metode_pembayaran}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Ringkasan Pesanan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>

                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.barang.gambar ? `/assets/images/${item.barang.gambar}` : "/api/placeholder/64/64"}
                              alt={item.barang.nama_barang}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {item.barang.nama_barang}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {item.barang.kode_barang}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-sm font-medium text-blue-600">
                                  {formatCurrency(item.barang.harga_setelah_diskon)}
                                </span>
                                {item.barang.diskon > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    -{item.barang.diskon}%
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-600">
                                x{item.jumlah}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Subtotal ({cartItems.reduce((sum, item) => sum + item.jumlah, 0)} item)
                        </span>
                        <span className="font-medium">{formatCurrency(subtotal + totalSavings)}</span>
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
                        <span className="font-medium text-green-600">GRATIS</span>
                      </div>

                      <hr />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Bayar</span>
                        <span className="text-blue-600">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full mt-6"
                      size="lg"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Buat Pesanan
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Dengan membuat pesanan, Anda menyetujui{' '}
                      <Link href="/terms" className="underline hover:no-underline">
                        syarat dan ketentuan
                      </Link>{' '}
                      yang berlaku.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
