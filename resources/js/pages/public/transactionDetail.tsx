import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Eye, Download, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FooterSection from '@/components/landingpage/Footer';
import { useShop } from '@/context/ShopContext';

interface TransactionItem {
  barang_id: number;
  nama_barang: string;
  kode_barang: string;
  harga_satuan: number;
  harga_setelah_diskon: number;
  diskon: number;
  jumlah: number;
  subtotal: number;
}

interface Transaction {
  id: number;
  kode_transaksi: string;
  items: TransactionItem[];
  total_harga: number;
  diskon_total: number;
  total_bayar: number;
  status: string;
  status_label: string;
  status_badge_color: string;
  metode_pembayaran: string;
  bukti_pembayaran?: string;
  alamat_pengiriman: string;
  batas_pembayaran?: string;
  dibayar_pada?: string;
  diproses_pada?: string;
  selesai_pada?: string;
  created_at: string;
  updated_at: string;
  can_be_paid: boolean;
  is_expired: boolean;
}

interface Props {
  transaction: Transaction;
}

export default function TransactionDetail({ transaction }: Props) {
  const { showToast } = useShop();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'menunggu_pembayaran':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dibayar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'diproses':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dibatalkan':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer_bank':
        return 'Transfer Bank';
      case 'e_wallet':
        return 'E-Wallet';
      case 'cod':
        return 'COD (Cash on Delivery)';
      default:
        return method;
    }
  };

  const handleCancelTransaction = async () => {
    if (!confirm('Yakin ingin membatalkan transaksi ini?')) {
      return;
    }

    try {
      const response = await fetch(`/public/transactions/${transaction.id}/cancel`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Transaksi berhasil dibatalkan', 'success');
        window.location.reload();
      } else {
        showToast(data.error || 'Gagal membatalkan transaksi', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan saat membatalkan transaksi', 'error');
    }
  };

  return (
    <>
      <NavigationComponent />
      <Head title={`Detail Transaksi - ${transaction.kode_transaksi}`} />

      <div className="min-h-screen bg-gray-50 mt-32">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/public/transactions">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detail Transaksi
                </h1>
                <p className="text-gray-600">
                  {transaction.kode_transaksi}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`px-3 py-1 ${getStatusColor(transaction.status)}`}
            >
              {transaction.status_label}
            </Badge>
          </div>

          {/* Status Alerts */}
          {transaction.is_expired && (
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Batas waktu pembayaran telah berakhir. Silakan hubungi customer service jika Anda sudah melakukan pembayaran.
              </AlertDescription>
            </Alert>
          )}

          {transaction.can_be_paid && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                Transaksi menunggu pembayaran.
                <Link
                  href={`/public/payment/${transaction.id}`}
                  className="ml-2 font-medium underline hover:no-underline"
                >
                  Lanjutkan Pembayaran
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Transaction Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Status Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Pesanan Dibuat</p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>

                    {transaction.dibayar_pada && (
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Pembayaran Diterima</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.dibayar_pada)}</p>
                        </div>
                      </div>
                    )}

                    {transaction.diproses_pada && (
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Pesanan Diproses</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.diproses_pada)}</p>
                        </div>
                      </div>
                    )}

                    {transaction.selesai_pada && (
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          4
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Pesanan Selesai</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.selesai_pada)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Produk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{item.nama_barang}</h4>
                          <p className="text-sm text-gray-600">Kode: {item.kode_barang}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-medium text-blue-600">
                              {formatCurrency(item.harga_setelah_diskon)}
                            </span>
                            {item.diskon > 0 && (
                              <>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(item.harga_satuan)}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  -{item.diskon}%
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.jumlah}</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(transaction.total_harga)}</span>
                    </div>
                    {transaction.diskon_total > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diskon</span>
                        <span className="text-green-600">-{formatCurrency(transaction.diskon_total)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ongkos Kirim</span>
                      <span className="text-green-600">GRATIS</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Total Bayar</span>
                      <span className="text-blue-600">{formatCurrency(transaction.total_bayar)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Informasi Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Metode Pembayaran</p>
                      <p className="text-gray-600">{getPaymentMethodLabel(transaction.metode_pembayaran)}</p>
                    </div>

                    {transaction.batas_pembayaran && (
                      <div>
                        <p className="font-medium text-gray-900">Batas Pembayaran</p>
                        <p className="text-gray-600">{formatDate(transaction.batas_pembayaran)}</p>
                      </div>
                    )}

                    {transaction.bukti_pembayaran && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Bukti Pembayaran</p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/storage/${transaction.bukti_pembayaran}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `/storage/${transaction.bukti_pembayaran}`;
                              link.download = `bukti_pembayaran_${transaction.kode_transaksi}`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Informasi Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-2">Alamat Pengiriman</p>
                    <p className="text-gray-600 leading-relaxed">
                      {transaction.alamat_pengiriman}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Informasi Transaksi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Tanggal Pemesanan</p>
                      <p className="text-gray-600">{formatDate(transaction.created_at)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Terakhir Diupdate</p>
                      <p className="text-gray-600">{formatDate(transaction.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                {transaction.can_be_paid && (
                  <Link href={`/public/payment/${transaction.id}`}>
                    <Button className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Lanjutkan Pembayaran
                    </Button>
                  </Link>
                )}

                {(transaction.status === 'pending' || transaction.status === 'menunggu_pembayaran') && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCancelTransaction}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Batalkan Pesanan
                  </Button>
                )}

                <Link href="/public/transactions">
                  <Button variant="outline" className="w-full">
                    Lihat Semua Transaksi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
