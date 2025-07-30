import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Jasa {
    id: number;
    nama_jasa: string;
    kode_jasa: string;
    foto: string | null;
    harga: number;
    kategori: string | null;
    display: boolean;
    status_rekomendasi: boolean;
    created_at: string;
}

interface Props {
    jasa: Jasa[];
    kategori: string[];
}

export default function ServiceIndex({ jasa, kategori }: Props) {
    const [search, setSearch] = useState('');
    const [selectedKategori, setSelectedKategori] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('semua');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredJasa = useMemo(() => {
        let filtered = jasa.filter((item) => {
            const matchSearch =
                search === '' ||
                item.nama_jasa.toLowerCase().includes(search.toLowerCase()) ||
                item.kode_jasa.toLowerCase().includes(search.toLowerCase());

            const matchKategori = selectedKategori === 'all' || item.kategori === selectedKategori;

            const matchStatus =
                statusFilter === 'semua' ||
                (statusFilter === 'aktif' && item.display) ||
                (statusFilter === 'nonaktif' && !item.display) ||
                (statusFilter === 'rekomendasi' && item.status_rekomendasi);

            return matchSearch && matchKategori && matchStatus;
        });

        filtered.sort((a, b) => {
            let aValue = a[sortBy as keyof Jasa];
            let bValue = b[sortBy as keyof Jasa];

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
    }, [jasa, search, selectedKategori, statusFilter, sortBy, sortOrder]);

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jasa "${nama}"?`)) {
            router.delete(route('admin.services.jasa.destroy', id));
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

    const breadcrumbs = [
        {
            title: 'Manajemen Jasa',
            href: route('admin.services.jasa'),
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Jasa" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Jasa</h1>
                        <p className="text-gray-600">Kelola jasa yang tersedia</p>
                    </div>
                    <Link href={route('admin.services.jasa.create')}>
                        <Button className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Jasa</span>
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter dan Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input placeholder="Cari jasa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
                                    <SelectItem value="nama_jasa">Nama Jasa</SelectItem>
                                    <SelectItem value="harga">Harga</SelectItem>
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
                        <CardTitle>Daftar Jasa ({filteredJasa.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredJasa.length === 0 ? (
                            <div className="py-8 text-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">Tidak ada jasa ditemukan</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Jasa</TableHead>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Harga</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredJasa.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {item.foto ? (
                                                            <img
                                                                src={`/storage/${item.foto}`}
                                                                alt={item.nama_jasa}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                                                <span className="text-gray-400 text-xs text-center">No Image</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.nama_jasa}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="rounded bg-gray-100 px-2 py-1 text-sm">{item.kode_jasa}</code>
                                                </TableCell>
                                                <TableCell>
                                                    {item.kategori ? (
                                                        <Badge variant="outline">{item.kategori}</Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">{formatCurrency(item.harga)}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col space-y-1">
                                                        <Badge variant={item.display ? 'default' : 'secondary'}>
                                                            {item.display ? 'Aktif' : 'Non-aktif'}
                                                        </Badge>
                                                        {item.status_rekomendasi && (
                                                            <Badge variant="outline" className="text-yellow-600">
                                                                Rekomendasi
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">{formatDate(item.created_at)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('admin.services.jasa.show', item.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.services.jasa.edit', item.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id, item.nama_jasa)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
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
