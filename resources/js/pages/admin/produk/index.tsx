import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, EyeOff, Plus, Search, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Produk {
    id: number;
    nama_barang: string;
    kode_barang: string;
    gambar: string | null;
    stok: string;
    harga_jual: number;
    diskon: number;
    kategori: string | null;
    display: boolean;
    status_rekomendasi: boolean;
    total_likes: number;
    feedbacks_count: number;
    harga_setelah_diskon: number;
    average_rating: number;
    created_at: string;
}

interface Props {
    produk: Produk[];
    kategori: string[];
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

export default function ProdukIndex({ produk, kategori }: Props) {
    const handleToggleDisplay = (id: number, currentStatus: boolean) => {
        router.patch(route('admin.produk.kelola.toggle-display', id), {
            display: !currentStatus,
        });
    };

    const handleToggleRecommendation = (id: number, currentStatus: boolean) => {
        router.patch(route('admin.produk.kelola.toggle-rekomendasi', id), {
            status_rekomendasi: !currentStatus,
        });
    };
    const [search, setSearch] = useState('');
    const [selectedKategori, setSelectedKategori] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('semua');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredProduk = useMemo(() => {
        let filtered = produk.filter((item) => {
            const matchSearch =
                search === '' ||
                item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
                item.kode_barang.toLowerCase().includes(search.toLowerCase());

            const matchKategori = selectedKategori === 'all' || item.kategori === selectedKategori;

            const matchStatus =
                statusFilter === 'semua' ||
                (statusFilter === 'aktif' && item.display) ||
                (statusFilter === 'nonaktif' && !item.display) ||
                (statusFilter === 'rekomendasi' && item.status_rekomendasi);

            return matchSearch && matchKategori && matchStatus;
        });

        filtered.sort((a, b) => {
            let aValue = a[sortBy as keyof Produk];
            let bValue = b[sortBy as keyof Produk];

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
    }, [produk, search, selectedKategori, statusFilter, sortBy, sortOrder]);

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${nama}"?`)) {
            router.delete(route('admin.produk.kelola.destroy', id));
        }
    };

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
            day: '2-digit',
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kelola Produk',
            href: route('admin.produk.kelola'),
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Produk" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
                        <p className="text-gray-600">Manajemen produk dan inventory</p>
                    </div>
                    <Link href={route('admin.produk.kelola.create')}>
                        <Button className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Produk</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <ShoppingCart className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Produk</p>
                                    <p className="text-2xl font-bold">{produk.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Eye className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Produk Aktif</p>
                                    <p className="text-2xl font-bold">{produk.filter((p) => p.display).length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Rekomendasi</p>
                                    <p className="text-2xl font-bold">{produk.filter((p) => p.status_rekomendasi).length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <EyeOff className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Stok Habis</p>
                                    <p className="text-2xl font-bold">{produk.filter((p) => parseInt(p.stok) === 0).length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter dan Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                            </div>

                            <Select value={selectedKategori} onValueChange={setSelectedKategori}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {kategori.map((kat) => (
                                        <SelectItem key={kat} value={kat}>
                                            {kat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Status</SelectItem>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Non-aktif</SelectItem>
                                    <SelectItem value="rekomendasi">Rekomendasi</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                                    <SelectItem value="nama_barang">Nama Produk</SelectItem>
                                    <SelectItem value="harga_jual">Harga</SelectItem>
                                    <SelectItem value="stok">Stok</SelectItem>
                                    <SelectItem value="total_likes">Likes</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Terbaru</SelectItem>
                                    <SelectItem value="asc">Terlama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk ({filteredProduk.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredProduk.length === 0 ? (
                            <div className="py-8 text-center">
                                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <p className="text-gray-500">Tidak ada produk ditemukan</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produk</TableHead>
                                            <TableHead className="hidden md:table-cell">Kode</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Harga</TableHead>
                                            <TableHead>Stok</TableHead>
                                           <TableHead>Tampil</TableHead>
                                            <TableHead className="hidden md:table-cell">Rating</TableHead>
                                            <TableHead>Likes</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProduk.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer transition-colors hover:bg-gray-50"
                                                onClick={() => (window.location.href = route('admin.produk.kelola.show', item.id))}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {item.gambar ? (
                                                            <img
                                                                src={`/storage/${item.gambar}`}
                                                                alt={item.nama_barang}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                                                <ShoppingCart className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.nama_barang}</p>
                                                            {item.diskon > 0 && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    -{item.diskon}%
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="rounded bg-gray-100 px-2 py-1 text-sm">{item.kode_barang}</code>
                                                </TableCell>
                                                <TableCell>
                                                    {item.kategori ? (
                                                        <Badge variant="outline">{item.kategori}</Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        {item.diskon > 0 ? (
                                                            <>
                                                                <p className="font-medium text-green-600">
                                                                    {formatCurrency(item.harga_setelah_diskon)}
                                                                </p>
                                                                <p className="text-sm text-gray-400 line-through">
                                                                    {formatCurrency(item.harga_jual)}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="font-medium">{formatCurrency(item.harga_jual)}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            parseInt(item.stok) === 0
                                                                ? 'destructive'
                                                                : parseInt(item.stok) < 10
                                                                  ? 'secondary'
                                                                  : 'default'
                                                        }
                                                    >
                                                        {item.stok}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col space-y-1">
                                                        <Badge variant={item.display ? 'default' : 'secondary'}>
                                                            {item.display ? 'Aktif' : 'Non-aktif'}
                                                        </Badge>
                                                        {item.status_rekomendasi && (
                                                            <Badge variant="outline" className="text-yellow-600">
                                                                <Star className="mr-1 h-3 w-3" />
                                                                Rekomendasi
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                        <span className="text-sm">
                                                            {item.average_rating.toFixed(1)} ({item.feedbacks_count})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-sm font-medium">{item.total_likes}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">{formatDate(item.created_at)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('admin.produk.kelola.edit', item.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id, item.nama_barang)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleDisplay(item.id, item.display);
                                                            }}
                                                            className={item.display ? 'text-green-600' : 'text-gray-500'}
                                                            title={item.display ? 'Nonaktifkan' : 'Aktifkan'}
                                                        >
                                                            {item.display ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleRecommendation(item.id, item.status_rekomendasi);
                                                            }}
                                                            className={item.status_rekomendasi ? 'text-yellow-500' : 'text-gray-500'}
                                                            title={item.status_rekomendasi ? 'Hapus rekomendasi' : 'Jadikan rekomendasi'}
                                                        >
                                                            <Star className="h-4 w-4" fill={item.status_rekomendasi ? 'currentColor' : 'none'} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
