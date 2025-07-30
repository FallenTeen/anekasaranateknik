import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Eye, CreditCard, Clock, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationComponent from '@/components/landingpage/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FooterSection from '@/components/landingpage/Footer';

interface Transaction {
  id: number;
  kode_transaksi: string;
  total_bayar: number;
  status: string;
  status_label: string;
  status_badge_color: string;
  metode_pembayaran: string;
  batas_pembayaran?: string;
  created_at: string;
  can_be_paid: boolean;
  is_expired: boolean;
  items_count: number;
}

interface PaginationData {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Props {
  transactions: PaginationData;
}

export default function TransactionList({ transactions }: Props) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
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
        return 'COD';
      default:
        return method;
    }
  };

  const filteredTransactions = transactions.data.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSearch = transaction.kode_transaksi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <NavigationComponent />
      <Head title="Riwayat Transaksi - PT. Aneka Sarana Teknik" />

      <div className="min-h-screen bg-gray-50 mt-32">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Riwayat Transaksi
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola dan pantau semua transaksi Anda
              </p>
            </div>
            <Link href="/public/products">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Belanja Lagi
              </Button>
            </Link>
          </div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari kode transaksi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="menunggu_pembayaran">Menunggu Pembayaran</SelectItem>
                      <SelectItem value="dibayar">Sudah Dibayar</SelectItem>
                      <SelectItem value="diproses">Sedang Diproses</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {transactions.data.length === 0 ? 'Belum Ada Transaksi' : 'Tidak Ada Transaksi Ditemukan'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {transactions.data.length === 0
                    ? 'Anda belum memiliki transaksi. Mari mulai berbelanja!'
                    : 'Coba ubah filter atau kata kunci pencarian Anda.'
                  }
                </p>
                {transactions.data.length === 0 && (
                  <Link href="/public/products">
                    <Button size="lg">
                      <Package className="w-5 h-5 mr-2" />
                      Mulai Belanja
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.kode_transaksi}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(transaction.status)} text-xs`}
                          >
                            {transaction.status_label}
                          </Badge>
                          {transaction.is_expired && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{formatDate(transaction.created_at)}</span>
                          <span>•</span>
                          <span>{transaction.items_count} item</span>
                          <span>•</span>
                          <span>{getPaymentMethodLabel(transaction.metode_pembayaran)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600 mb-2">
                          {formatCurrency(transaction.total_bayar)}
                        </p>
                        <div className="flex space-x-2">
                          <Link href={`/public/transactions/${transaction.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </Link>
                          {transaction.can_be_paid && (
                            <Link href={`/public/payment/${transaction.id}`}>
                              <Button size="sm">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Bayar
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Deadline */}
                    {transaction.batas_pembayaran && !transaction.is_expired &&
                     (transaction.status === 'pending' || transaction.status === 'menunggu_pembayaran') && (
                      <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>
                          Batas pembayaran: {formatDate(transaction.batas_pembayaran)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {transactions.last_page > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-600">
                Menampilkan {transactions.from} - {transactions.to} dari {transactions.total} transaksi
              </p>
              <div className="flex space-x-2">
                {transactions.current_page > 1 && (
                  <Link href={`?page=${transactions.current_page - 1}`}>
                    <Button variant="outline" size="sm">
                      Sebelumnya
                    </Button>
                  </Link>
                )}

                {Array.from({ length: Math.min(5, transactions.last_page) }, (_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === transactions.current_page;

                  return (
                    <Link key={page} href={`?page=${page}`}>
                      <Button
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        className="w-10 h-10 p-0"
                      >
                        {page}
                      </Button>
                    </Link>
                  );
                })}

                {transactions.current_page < transactions.last_page && (
                  <Link href={`?page=${transactions.current_page + 1}`}>
                    <Button variant="outline" size="sm">
                      Selanjutnya
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </>
  );
}
