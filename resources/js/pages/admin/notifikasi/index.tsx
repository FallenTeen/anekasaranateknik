import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Eye, EyeOff, Mail, MailOpen, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';

export default function NotifikasiIndex({ notifikasi, statistik }) {
    const [statusFilter, setStatusFilter] = useState('semua');
    const [typeFilter, setTypeFilter] = useState('semua');

    const filteredNotifikasi = notifikasi.data.filter(notif => {
        const matchStatus = statusFilter === 'semua' ||
            (statusFilter === 'belum_dibaca' && !notif.dibaca) ||
            (statusFilter === 'sudah_dibaca' && notif.dibaca);

        const matchType = typeFilter === 'semua' || notif.type === typeFilter;

        return matchStatus && matchType;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleMarkAsRead = (id) => {
        router.put(route('admin.notifikasi.markAsRead', id));
    };

    const handleDelete = (id) => {
        router.delete(route('admin.notifikasi.destroy', id));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Notifikasi', href: route('admin.notifikasi') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Notifikasi" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Notifikasi</h1>
                        <p className="text-gray-600">Manajemen notifikasi sistem</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Notifikasi</p>
                                    <p className="text-2xl font-bold">{statistik.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <EyeOff className="h-5 w-5 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Belum Dibaca</p>
                                    <p className="text-2xl font-bold">{statistik.belum_dibaca}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <MailOpen className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">User Baru</p>
                                    <p className="text-2xl font-bold">{statistik.user_registered}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Item Disukai</p>
                                    <p className="text-2xl font-bold">{statistik.item_liked}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Notifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="semua">Semua Status</option>
                                    <option value="belum_dibaca">Belum Dibaca</option>
                                    <option value="sudah_dibaca">Sudah Dibaca</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Notifikasi</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="semua">Semua Jenis</option>
                                    <option value="user_registered">User Baru</option>
                                    <option value="item_liked">Item Disukai</option>
                                    <option value="item_masuk_keranjang">Item Masuk Keranjang</option>
                                    <option value="payment_selesai">Pembayaran Selesai</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Notifikasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Pesan</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNotifikasi.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center py-8">
                                            <MailOpen className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-gray-500">Tidak ada notifikasi</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNotifikasi.map(notif => (
                                        <TableRow key={notif.id} className={notif.dibaca ? 'bg-white' : 'bg-blue-50'}>
                                            <TableCell className="font-medium">{notif.judul}</TableCell>
                                            <TableCell>{notif.pesan}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {notif.type === 'user_registered' && 'User Baru'}
                                                    {notif.type === 'item_liked' && 'Item Disukai'}
                                                    {notif.type === 'item_masuk_keranjang' && 'Item Masuk Keranjang'}
                                                    {notif.type === 'payment_selesai' && 'Pembayaran Selesai'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={notif.dibaca ? 'default' : 'secondary'}>
                                                    {notif.dibaca ? 'Sudah Dibaca' : 'Belum Dibaca'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(notif.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {!notif.dibaca && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleMarkAsRead(notif.id)}
                                                        >
                                                            <MailOpen className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(notif.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
