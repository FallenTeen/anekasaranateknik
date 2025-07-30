import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayouts from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { ArrowRight, Search } from 'lucide-react';

interface TransaksiItem {
    barang_id: number;
    nama_barang: string;
    kode_barang: string;
    harga_satuan: number;
    harga_setelah_diskon: number;
    diskon: number;
    jumlah: number;
    subtotal: number;
}

interface Transaksi {
    id: number;
    kode_transaksi: string;
    user_id: number;
    user_name: string;
    total_harga: number;
    diskon_total: number;
    total_bayar: number;
    status: string;
    status_label: string;
    status_badge_color: string;
    metode_pembayaran: string;
    batas_pembayaran: string;
    created_at: string;
    can_be_paid: boolean;
    is_expired: boolean;
    items_count: number;
}

interface Props {
    transaksi: Transaksi[];
    statistik: {
        total_transaksi: number;
        menunggu_pembayaran: number;
        dibayar: number;
        diproses: number;
        selesai: number;
        expired: number;
    };
}

export default function TransaksiIndex({ transaksi, statistik }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('semua');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredTransaksi = useMemo(() => {
        return transaksi.filter((trx) => {
            const matchesSearch =
                trx.kode_transaksi.toLowerCase().includes(search.toLowerCase()) || trx.user_name.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'semua' || trx.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transaksi, search, statusFilter]);

    const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);
    const paginatedTransaksi = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransaksi.slice(start, start + itemsPerPage);
    }, [filteredTransaksi, currentPage, itemsPerPage]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    const breadcrumbs = [
        { title: 'Kelola Produk', href: route('admin.produk.transaksi') },
    ];

    return (
        <AppSidebarLayouts breadcrumbs={breadcrumbs}>
            <Head title="Kelola Transaksi" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Kelola Transaksi</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                className="w-full pl-10 md:w-[300px]"
                                placeholder="Cari transaksi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="semua">Semua Status</SelectItem>
                                <SelectItem value="menunggu_pembayaran">Menunggu Pembayaran</SelectItem>
                                <SelectItem value="dibayar">Sudah Dibayar</SelectItem>
                                <SelectItem value="diproses">Diproses</SelectItem>
                                <SelectItem value="selesai">Selesai</SelectItem>
                                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">Total Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700">{statistik.total_transaksi}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-amber-800">Menunggu Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700">{statistik.menunggu_pembayaran}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-200 bg-indigo-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-800">Sudah Dibayar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-700">{statistik.dibayar}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-800">Diproses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700">{statistik.diproses}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">Selesai</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{statistik.selesai}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {paginatedTransaksi.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Metode</TableHead>
                                        <TableHead>Batas Pembayaran</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTransaksi.map((trx) => (
                                        <TableRow key={trx.id}>
                                            <TableCell className="font-medium">{trx.kode_transaksi}</TableCell>
                                            <TableCell>{trx.user_name}</TableCell>
                                            <TableCell>{formatCurrency(trx.total_bayar)}</TableCell>
                                            <TableCell>
                                                <Badge variant={trx.status_badge_color as any}>{trx.status_label}</Badge>
                                                {trx.is_expired && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        Kadaluarsa
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="capitalize">{trx.metode_pembayaran.replace('_', ' ')}</TableCell>
                                            <TableCell>{trx.batas_pembayaran ? formatDate(trx.batas_pembayaran) : '-'}</TableCell>
                                            <TableCell>{formatDate(trx.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={route('admin.produk.transaksi.show', trx.id)}>
                                                    <Button size="sm" variant="outline">
                                                        Lihat
                                                        <ArrowRight className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada transaksi ditemukan</h3>
                                <p className="mt-2 text-sm text-gray-500">Tidak ada transaksi yang cocok dengan kriteria pencarian Anda.</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="border-t px-6 py-4">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayouts>
    );
}
