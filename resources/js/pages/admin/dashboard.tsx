import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Package,
  ShoppingCart,
  Heart,
  Bell,
  Star,
  TrendingUp,
  Eye,
  Search,
  Filter,
  ChevronRight,
  Home,
  AlertTriangle
} from 'lucide-react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: 'admin/dashboard',
    },
];

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Barang {
  id: number;
  nama_barang: string;
  kode_barang: string;
  kategori: string;
  harga_jual: number;
  harga_setelah_diskon: number;
  stok: number;
  display: boolean;
  status_rekomendasi: boolean;
  gambar: string;
  total_likes: number;
  average_rating: number;
}

interface Keranjang {
  id: number;
  user: User;
  barang: Barang;
  jumlah: number;
  total_harga: number;
}

interface Notifikasi {
  id: number;
  type: string;
  judul: string;
  pesan: string;
  dibaca: boolean;
  created_at: string;
  data: any;
}

interface UserFeedback {
  id: number;
  user: User;
  barang: Barang;
  feedback: string;
  rating: number;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_admins: number;
  total_products: number;
  displayed_products: number;
  recommended_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_cart_items: number;
  total_cart_value: number;
  unread_notifications: number;
  total_feedbacks: number;
  average_rating: number;
  total_likes: number;
}

interface DashboardProps {
  stats: Stats;
  users: User[];
  barangs: Barang[];
  keranjangs: Keranjang[];
  notifikasis: Notifikasi[];
  feedbacks: UserFeedback[];
  popularProducts: Barang[];
  lowStockProducts: Barang[];
  topRatedProducts: Barang[];
  monthlyUserRegistrations: Record<string, number>;
  categoryStats: Record<string, any>;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  users,
  barangs: initialBarangs,
  keranjangs,
  notifikasis,
  feedbacks,
  popularProducts,
  lowStockProducts,
  topRatedProducts
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBarangs = useMemo(() => {
    if (!searchTerm.trim()) {
      return initialBarangs;
    }

    return initialBarangs.filter(barang =>
      barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kode_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialBarangs, searchTerm]);

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
    });
  };

  const recentUsers = useMemo(() => {
    return users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [users]);

  const recentNotifications = useMemo(() => {
    return notifikasis
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [notifikasis]);

  const recentCartActivity = useMemo(() => {
    return keranjangs.slice(0, 10);
  }, [keranjangs]);

  const recentFeedbacks = useMemo(() => {
    return feedbacks
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [feedbacks]);


  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>

        <Head title="Dashboard Admin" />

      <div className="p-6 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            {stats.unread_notifications > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.unread_notifications}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">
                {recentUsers.length} pengguna terbaru
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_products}</div>
              <p className="text-xs text-muted-foreground">
                {stats.low_stock_products} produk stok rendah
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Item di Keranjang</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_cart_items}</div>
              <p className="text-xs text-muted-foreground">
                Total nilai: {formatCurrency(stats.total_cart_value)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Dari {stats.total_feedbacks} ulasan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pengguna Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-400">{formatDate(user.created_at)}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Produk Terpopuler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularProducts.slice(0, 5).map((barang) => (
                  <div key={barang.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {barang.gambar && (
                        <img
                          src={`/assets/images/${barang.gambar}`}
                          alt={barang.nama_barang}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{barang.nama_barang}</p>
                        <p className="text-xs text-gray-600">{barang.kategori}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{barang.total_likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{barang.average_rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Produk Rating Tertinggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRatedProducts.slice(0, 5).map((barang) => (
                  <div key={barang.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {barang.gambar && (
                        <img
                          src={`/assets/images/${barang.gambar}`}
                          alt={barang.nama_barang}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{barang.nama_barang}</p>
                        <p className="text-xs text-gray-600">{barang.kategori}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(barang.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm ml-1">{barang.average_rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {stats.low_stock_products > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Produk Stok Rendah ({stats.low_stock_products} produk)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.slice(0, 6).map((barang) => (
                  <div key={barang.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      {barang.gambar && (
                        <img
                          src={`/assets/images/${barang.gambar}`}
                          alt={barang.nama_barang}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{barang.nama_barang}</p>
                        <p className="text-xs text-gray-600">{barang.kode_barang}</p>
                      </div>
                    </div>
                    <Badge variant={barang.stok === 0 ? 'destructive' : 'secondary'}>
                      {barang.stok}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manajemen Produk ({filteredBarangs.length} produk)
              </CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Produk</th>
                    <th className="text-left p-2">Kode</th>
                    <th className="text-left p-2">Kategori</th>
                    <th className="text-left p-2">Harga</th>
                    <th className="text-left p-2">Stok</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBarangs.slice(0, 15).map((barang) => (
                    <tr key={barang.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          {barang.gambar && (
                            <img
                              src={`/assets/images/${barang.gambar}`}
                              alt={barang.nama_barang}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{barang.nama_barang}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Heart className="h-3 w-3" />
                              {barang.total_likes}
                              <Star className="h-3 w-3" />
                              {barang.average_rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-sm text-gray-600">{barang.kode_barang}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">{barang.kategori}</Badge>
                      </td>
                      <td className="p-2 font-medium text-sm">
                        {formatCurrency(barang.harga_jual)}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={barang.stok === 0 ? 'destructive' : barang.stok <= 10 ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {barang.stok}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          {barang.display && (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Tampil
                            </Badge>
                          )}
                          {barang.status_rekomendasi && (
                            <Badge variant="default" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Rekomendasi
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBarangs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada produk yang ditemukan
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikasi Terbaru ({stats.unread_notifications} belum dibaca)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentNotifications.map((notifikasi) => (
                  <div
                    key={notifikasi.id}
                    className={`p-3 border rounded-lg ${!notifikasi.dibaca ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{notifikasi.judul}</p>
                        <p className="text-sm text-gray-600">{notifikasi.pesan}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {notifikasi.type}
                        </Badge>
                      </div>
                      {!notifikasi.dibaca && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(notifikasi.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Aktivitas Keranjang ({stats.total_cart_items} item)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentCartActivity.map((keranjang) => (
                  <div key={keranjang.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {keranjang.barang.gambar && (
                          <img
                            src={`/assets/images/${keranjang.barang.gambar}`}
                            alt={keranjang.barang.nama_barang}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{keranjang.user.name}</p>
                          <p className="text-sm text-gray-600">{keranjang.barang.nama_barang}</p>
                          <p className="text-xs text-gray-400">Jumlah: {keranjang.jumlah}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(keranjang.total_harga)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ulasan Terbaru ({stats.total_feedbacks} total ulasan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {feedback.barang.gambar && (
                        <img
                          src={feedback.barang.gambar}
                          alt={feedback.barang.nama_barang}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{feedback.user.name}</p>
                        <p className="text-sm text-gray-600">{feedback.barang.nama_barang}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(feedback.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
};

export default Dashboard;
