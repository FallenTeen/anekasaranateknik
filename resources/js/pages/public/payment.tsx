import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Clock, Upload, CreditCard, AlertCircle, CheckCircle, XCircle, MapPin, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import FooterSection from '@/components/landingpage/Footer';
import { useShop } from '@/context/ShopContext';

interface TransactionItem {
  barang_id: number;
  nama_barang: string;
  kode_barang: string;
  harga_satua: number;
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
  metode_pembayaran: string;
  alamat_pengiriman: string;
  batas_pembayaran: string;
  created_at: string;
}

interface Props {
  transaction: Transaction;
}

export default function PaymentPage({ transaction }: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const { showToast } = useShop();

  const { data, setData, post, processing, errors, progress } = useForm({
    bukti_pembayaran: null as File | null,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadline = new Date(transaction.batas_pembayaran).getTime();
      const difference = deadline - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [transaction.batas_pembayaran]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Format file harus JPG, PNG, atau PDF', 'error');
        return;
      }

      setData('bukti_pembayaran', file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.bukti_pembayaran) {
      showToast('Silakan pilih file bukti pembayaran', 'error');
      return;
    }

    post(`/public/payment/${transaction.id}/upload`, {
      onSuccess: () => {
        showToast('Bukti pembayaran berhasil diupload', 'success');
        setPaymentProofUploaded(true);
      },
      onError: (errors) => {
        const errorMessage = Object.values(errors)[0] as string || 'Gagal mengupload bukti pembayaran';
        showToast(errorMessage, 'error');
      }
    });
  };

  const getPaymentInstructions = () => {
    switch (transaction.metode_pembayaran) {
      case 'transfer_bank':
        return {
          title: 'Transfer Bank',
          instructions: [
            'Transfer ke rekening: BCA 1234567890',
            'Atas nama: PT. Aneka Sarana Teknik',
            'Nominal: ' + formatCurrency(transaction.total_bayar),
            'Simpan bukti transfer untuk diupload'
          ]
        };
      case 'e_wallet':
        return {
          title: 'E-Wallet',
          instructions: [
            'Transfer ke nomor: 081234567890 (GoPay/OVO/Dana)',
            'Atas nama: PT. Aneka Sarana Teknik',
            'Nominal: ' + formatCurrency(transaction.total_bayar),
            'Simpan bukti transfer untuk diupload'
          ]
        };
      case 'cod':
        return {
          title: 'COD (Cash on Delivery)',
          instructions: [
            'Pembayaran dilakukan saat barang sampai',
            'Siapkan uang pas: ' + formatCurrency(transaction.total_bayar),
            'Petugas akan menghubungi Anda untuk pengiriman',
            'Tidak perlu upload bukti pembayaran'
          ]
        };
      default:
        return {
          title: 'Pembayaran',
          instructions: ['Silakan hubungi customer service untuk instruksi pembayaran']
        };
    }
  };

  const paymentInfo = getPaymentInstructions();
  const isCOD = transaction.metode_pembayaran === 'cod';

  return (
    <>
      <NavigationComponent />
      <Head title={`Pembayaran - ${transaction.kode_transaksi}`} />

      <div className="min-h-screen bg-gray-50 mt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pembayaran Pesanan
            </h1>
            <p className="text-gray-600">
              Kode Transaksi: <span className="font-semibold">{transaction.kode_transaksi}</span>
            </p>
          </div>

          {/* Countdown Timer */}
          {!isCOD && !paymentProofUploaded && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Clock className={`w-6 h-6 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {isExpired ? 'Batas pembayaran telah berakhir' : 'Sisa waktu pembayaran'}
                    </p>
                    <div className="flex items-center space-x-2 text-2xl font-bold">
                      <div className={`px-3 py-2 rounded-lg ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </div>
                      <span className="text-gray-400">:</span>
                      <div className={`px-3 py-2 rounded-lg ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </div>
                      <span className="text-gray-400">:</span>
                      <div className={`px-3 py-2 rounded-lg ${isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Jam : Menit : Detik
                    </p>
                  </div>
                </div>
                {isExpired && (
                  <Alert variant="destructive" className="mt-4">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Batas waktu pembayaran telah berakhir. Silakan hubungi customer service atau buat pesanan baru.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Status */}
          {paymentProofUploaded && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Bukti pembayaran berhasil diupload. Pesanan Anda sedang diverifikasi oleh admin.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Payment Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {paymentInfo.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentInfo.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>

                {/* Upload Section */}
                {!isCOD && !paymentProofUploaded && !isExpired && (
                  <form onSubmit={handleSubmitPayment} className="mt-6 pt-6 border-t">
                    <Label htmlFor="bukti_pembayaran" className="text-sm font-medium text-gray-700 mb-2 block">
                      Upload Bukti Pembayaran
                    </Label>
                    <Input
                      id="bukti_pembayaran"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="mb-4"
                    />
                    {errors.bukti_pembayaran && (
                      <p className="text-red-500 text-sm mb-2">{errors.bukti_pembayaran}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-4">
                      Format: JPG, PNG, PDF. Maksimal 5MB
                    </p>
                    {progress && (
                      <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading... {progress.percentage}%</p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={processing || !data.bukti_pembayaran}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {processing ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                    </Button>
                  </form>
                )}

                {isCOD && (
                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Untuk metode COD, Anda tidak perlu melakukan pembayaran sekarang. 
                      Tim kami akan menghubungi Anda untuk konfirmasi pengiriman.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.nama_barang}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.harga_setelah_diskon)} x {item.jumlah}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                    
                    <div className="space-y-2 pt-4 border-t">
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
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total Bayar</span>
                        <span className="text-blue-600">{formatCurrency(transaction.total_bayar)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Informasi Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Alamat Pengiriman:</p>
                      <p className="text-gray-600">{transaction.alamat_pengiriman}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Metode Pembayaran:</p>
                      <Badge variant="outline">{transaction.status_label}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}