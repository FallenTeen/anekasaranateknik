import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, EyeOff, Star, Trash2 } from 'lucide-react';

interface Jasa {
    id: number;
    nama_jasa: string;
    kode_jasa: string;
    deskripsi: string | null;
    foto: string | null;
    snk: string | null;
    harga: number;
    kategori: string | null;
    display: boolean;
    status_rekomendasi: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    jasa: Jasa;
}

export default function ServiceShow({ jasa }: Props) {
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus jasa "${jasa.nama_jasa}"?`)) {
            router.delete(route('admin.services.jasa.destroy', jasa.id));
        }
    };

    const breadcrumbs = [
        { title: 'Manajemen Jasa', href: route('admin.services.jasa') },
        { title: jasa.nama_jasa, href: '#', current: true }
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Jasa - ${jasa.nama_jasa}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.services.jasa')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Detail Jasa</h1>
                            <p className="text-gray-600">Informasi lengkap tentang {jasa.nama_jasa}</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Link href={route('admin.services.jasa.edit', jasa.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Jasa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Jasa</p>
                                        <p className="font-medium">{jasa.nama_jasa}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Kode Jasa</p>
                                        <p className="font-medium">{jasa.kode_jasa}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Kategori</p>
                                        <p>{jasa.kategori || <span className="text-gray-400">-</span>}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Harga</p>
                                        <p className="font-medium">{formatCurrency(jasa.harga)}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Deskripsi</p>
                                    <p className="whitespace-pre-line">{jasa.deskripsi || <span className="text-gray-400">-</span>}</p>
                                </div>

                                {jasa.snk && (
                                    <div>
                                        <p className="text-sm text-gray-600">Syarat dan Ketentuan</p>
                                        <p className="whitespace-pre-line">{jasa.snk}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Jasa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {jasa.foto ? (
                                    <img
                                        src={`/storage/${jasa.foto}`}
                                        alt={jasa.nama_jasa}
                                        className="w-full h-64 object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-400">Tidak ada gambar</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Tampilkan di Frontend</p>
                                        <p className="text-sm text-gray-600">
                                            {jasa.display ? 'Aktif' : 'Nonaktif'}
                                        </p>
                                    </div>
                                    {jasa.display ? (
                                        <Eye className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Jasa Rekomendasi</p>
                                        <p className="text-sm text-gray-600">
                                            {jasa.status_rekomendasi ? 'Ya' : 'Tidak'}
                                        </p>
                                    </div>
                                    {jasa.status_rekomendasi ? (
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                        <Star className="h-5 w-5 text-gray-300" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Dibuat: {formatDate(jasa.created_at)}</p>
                                    <p className="text-sm text-gray-600">Diperbarui: {formatDate(jasa.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
