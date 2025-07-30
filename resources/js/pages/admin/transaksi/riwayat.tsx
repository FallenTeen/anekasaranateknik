import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, DollarSign, Download, Eye, Filter, MoreHorizontal, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface TransaksiItem {
    id: number;
    kode_transaksi: string;
    user_id: number;
    user: User;
    total_bayar: number;
    status: string;
    metode_pembayaran: string;
    dibayar_pada: string | null;
    selesai_pada: string | null;
    diproses_pada: string | null;
    created_at: string;
    catatan_admin: string | null;
    status_label: string;
    status_badge_color: string;
}

interface Statistik {
    total_selesai: number;
    total_dibatalkan: number;
    total_pendapatan: number;
    pendapatan_bulan_ini: number;
    pendapatan_hari_ini: number;
    rata_rata_transaksi: number;
}

interface ChartDataItem {
    tanggal?: string;
    periode?: string;
    total?: number;
    selesai?: number;
    dibatalkan?: number;
}

interface ChartData {
    pendapatan_harian: ChartDataItem[];
    transaksi_bulanan: ChartDataItem[];
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: TransaksiItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLinks[];
}

interface Props {
    transaksi: PaginatedData;
    statistik: Statistik;
    chartData: ChartData;
}

export default function RiwayatTransaksi({ transaksi, statistik, chartData }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);

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
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBadgeVariant = (color: string) => {
        switch (color) {
            case 'green':
                return 'default';
            case 'destructive':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const filteredTransaksi = useMemo(() => {
        return transaksi.data.filter((item) => {
            const matchesSearch =
                !searchTerm ||
                item.kode_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !statusFilter || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transaksi.data, searchTerm, statusFilter]);

    const handleExport = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);

        window.location.href = route('admin.produk.riwayat.export') + '?' + params.toString();
        setTimeout(() => setLoading(false), 2000);
    };

    const handleDetail = (id: number) => {
        router.get(route('admin.produk.transaksi.show', id));
    };

    const statsCards = [
        {
            title: 'Total Selesai',
            value: statistik.total_selesai.toLocaleString('id-ID'),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Dibatalkan',
            value: statistik.total_dibatalkan.toLocaleString('id-ID'),
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Total Pendapatan',
            value: formatCurrency(statistik.total_pendapatan),
            icon: DollarSign,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Pendapatan Bulan Ini',
            value: formatCurrency(statistik.pendapatan_bulan_ini),
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

   const breadcrumbs = [
        { title: 'Kelola Produk', href: route('admin.dashboard') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Transaksi" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
                        <p className="text-muted-foreground">Kelola dan lihat riwayat semua transaksi yang telah selesai atau dibatalkan</p>
                    </div>
                    <Button onClick={handleExport} disabled={loading}>
                        <Download className="mr-2 h-4 w-4" />
                        {loading ? 'Mengekspor...' : 'Ekspor CSV'}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                        <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                                            <Icon className={`h-4 w-4 ${stat.color}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Riwayat Transaksi</CardTitle>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan kode transaksi, nama, atau email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="w-40">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredTransaksi.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Tidak ada riwayat transaksi</h3>
                                <p className="text-muted-foreground">
                                    {searchTerm || statusFilter
                                        ? 'Tidak ada transaksi yang sesuai dengan filter yang diterapkan.'
                                        : 'Belum ada transaksi yang selesai atau dibatalkan.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode Transaksi</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Total Bayar</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Metode Pembayaran</TableHead>
                                            <TableHead>Tanggal Transaksi</TableHead>
                                            <TableHead>Tanggal Selesai</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransaksi.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.kode_transaksi}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{item.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{item.user.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{formatCurrency(item.total_bayar)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getBadgeVariant(item.status_badge_color)}>{item.status_label}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {item.metode_pembayaran ? item.metode_pembayaran.replace('_', ' ').toUpperCase() : '-'}
                                                </TableCell>
                                                <TableCell>{formatDate(item.created_at)}</TableCell>
                                                <TableCell>{item.selesai_pada ? formatDate(item.selesai_pada) : '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleDetail(item.id)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Lihat Detail
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {transaksi.last_page > 1 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {(transaksi.current_page - 1) * transaksi.per_page + 1} hingga{' '}
                                    {Math.min(transaksi.current_page * transaksi.per_page, transaksi.total)} dari {transaksi.total} hasil
                                </div>
                                <div className="flex items-center space-x-2">
                                    {transaksi.links.map((link, index) => {
                                        if (!link.url) return null;

                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => router.get(link.url!)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
