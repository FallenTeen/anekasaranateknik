import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { AlertCircle, ArrowLeft, Check, CheckCircle, Loader2, Truck, X } from 'lucide-react';

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
    user_email: string;
    items: TransaksiItem[];
    total_harga: number;
    diskon_total: number;
    total_bayar: number;
    status: string;
    status_label: string;
    status_badge_color: string;
    metode_pembayaran: string;
    alamat_pengiriman: string;
    catatan_admin?: string;
    bukti_pembayaran?: string;
    batas_pembayaran: string;
    dibayar_pada?: string;
    diproses_pada?: string;
    selesai_pada?: string;
    created_at: string;
    updated_at: string;
    can_be_paid: boolean;
    is_expired: boolean;
    can_be_processed: boolean;
}

interface Props {
    transaksi: Transaksi;
}

export default function TransaksiShow({ transaksi }: Props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(transaksi.status);
    const [catatan, setCatatan] = useState(transaksi.catatan_admin || '');

    const { post, errors } = useForm({
        status,
        catatan_admin: catatan,
    });

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

    const updateStatus = (newStatus: string) => {
        setStatus(newStatus);
    };
    const { put } = useForm({
        status,
        catatan_admin: catatan,
    });

    const submitStatusUpdate = () => {
        setLoading(true);
        put(route('admin.produk.transaksi.status', transaksi.id), {
            onFinish: () => setLoading(false),
        });
    };

    const breadcrumbs = [
        { title: 'Kelola Produk', href: route('admin.produk.transaksi') },
        { title: 'Tambahkan Produk', href: route('admin.produk.transaksi') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${transaksi.kode_transaksi}`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                            <span>Detail Transaksi</span>
                            <Badge variant={transaksi.status_badge_color as any}>{transaksi.status_label}</Badge>
                            {transaksi.is_expired && <Badge variant="destructive">Kadaluarsa</Badge>}
                        </h1>
                        <p className="mt-1 text-gray-500">{transaksi.kode_transaksi}</p>
                    </div>

                    <Link href="/admin/produk/transaksi">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produk</TableHead>
                                            <TableHead className="text-right">Harga</TableHead>
                                            <TableHead className="text-right">Diskon</TableHead>
                                            <TableHead className="text-right">Jumlah</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transaksi.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="font-medium">{item.nama_barang}</div>
                                                    <div className="text-sm text-gray-500">{item.kode_barang}</div>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.harga_satuan)}</TableCell>
                                                <TableCell className="text-right">{item.diskon > 0 ? `${item.diskon}%` : '-'}</TableCell>
                                                <TableCell className="text-right">{item.jumlah}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(transaksi.total_harga)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Total Diskon</span>
                                        <span className="text-green-600">-{formatCurrency(transaksi.diskon_total)}</span>
                                    </div>

                                    <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                        <span>Total Bayar</span>
                                        <span>{formatCurrency(transaksi.total_bayar)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pengiriman</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-1 text-sm font-medium text-gray-500">Alamat</h4>
                                        <p>{transaksi.alamat_pengiriman || '-'}</p>
                                    </div>

                                    <div>
                                        <h4 className="mb-1 text-sm font-medium text-gray-500">Metode Pembayaran</h4>
                                        <p className="capitalize">{transaksi.metode_pembayaran.replace('_', ' ')}</p>
                                    </div>

                                    {transaksi.bukti_pembayaran && (
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Bukti Pembayaran</h4>
                                            <a
                                                href={`/storage/${transaksi.bukti_pembayaran}`}
                                                target="_blank"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Lihat Bukti Pembayaran
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Transaksi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-1 text-sm font-medium text-gray-500">Dibuat Pada</h4>
                                        <p>{formatDate(transaksi.created_at)}</p>
                                    </div>

                                    {transaksi.batas_pembayaran && (
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Batas Pembayaran</h4>
                                            <p>{formatDate(transaksi.batas_pembayaran)}</p>
                                        </div>
                                    )}

                                    {transaksi.dibayar_pada && (
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Dibayar Pada</h4>
                                            <p>{formatDate(transaksi.dibayar_pada)}</p>
                                        </div>
                                    )}

                                    {transaksi.diproses_pada && (
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Diproses Pada</h4>
                                            <p>{formatDate(transaksi.diproses_pada)}</p>
                                        </div>
                                    )}

                                    {transaksi.selesai_pada && (
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-gray-500">Selesai Pada</h4>
                                            <p>{formatDate(transaksi.selesai_pada)}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ubah Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={status === 'dibayar' ? 'default' : 'outline'}
                                            onClick={() => updateStatus('dibayar')}
                                            disabled={loading}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Sudah Dibayar
                                        </Button>

                                        <Button
                                            variant={status === 'diproses' ? 'default' : 'outline'}
                                            onClick={() => updateStatus('diproses')}
                                            disabled={loading}
                                        >
                                            <Truck className="mr-2 h-4 w-4" />
                                            Diproses
                                        </Button>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={status === 'selesai' ? 'default' : 'outline'}
                                            onClick={() => updateStatus('selesai')}
                                            disabled={loading}
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Selesai
                                        </Button>

                                        <Button
                                            variant={status === 'dibatalkan' ? 'destructive' : 'outline'}
                                            onClick={() => updateStatus('dibatalkan')}
                                            disabled={loading}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Batalkan
                                        </Button>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Catatan Admin</label>
                                        <Textarea
                                            value={catatan}
                                            onChange={(e) => setCatatan(e.target.value)}
                                            placeholder="Tulis catatan untuk transaksi ini..."
                                        />
                                        {errors.catatan_admin && <p className="mt-1 text-sm text-red-500">{errors.catatan_admin}</p>}
                                    </div>

                                    {errors.status && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.status}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button className="w-full" onClick={submitStatusUpdate} disabled={loading || status === transaksi.status}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Customer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Nama</h4>
                                        <p>{transaksi.user_name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                        <p>{transaksi.user_email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
