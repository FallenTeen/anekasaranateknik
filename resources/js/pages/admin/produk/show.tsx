import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, EyeOff, ShoppingCart, Star, Trash2 } from 'lucide-react';

interface Produk {
    id: number;
    nama_barang: string;
    kode_barang: string;
    deskripsi: string | null;
    gambar: string | null;
    gambar_deskripsi: { url: string }[];
    stok: string;
    harga_beli: number;
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
    updated_at: string;
}

interface Props {
    produk: Produk;
}

interface BreadcrumbItem {
    title: string;
    href: string;
    current?: boolean;
}

export default function ProdukShow({ produk }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Produk', href: route('admin.produk.kelola') },
        { title: produk.nama_barang, href: '#', current: true },
    ];

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
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${produk.nama_barang}"?`)) {
            router.delete(route('admin.produk.kelola.destroy', produk.id));
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Produk - ${produk.nama_barang}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.produk.kelola')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Detail Produk</h1>
                            <p className="text-gray-600">Informasi lengkap tentang {produk.nama_barang}</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Link href={route('admin.produk.kelola.edit', produk.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Produk</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Produk</p>
                                        <p className="font-medium">{produk.nama_barang}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Kode Produk</p>
                                        <p className="font-medium">{produk.kode_barang}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Kategori</p>
                                        <p>{produk.kategori || <span className="text-gray-400">-</span>}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Stok</p>
                                        <Badge
                                            variant={
                                                parseInt(produk.stok) === 0 ? 'destructive' : parseInt(produk.stok) < 10 ? 'secondary' : 'default'
                                            }
                                        >
                                            {produk.stok}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Deskripsi</p>
                                    <p className="whitespace-pre-line">{produk.deskripsi || <span className="text-gray-400">-</span>}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Harga</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Harga Beli</p>
                                        <p>{formatCurrency(produk.harga_beli)}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Harga Jual</p>
                                        <p>{formatCurrency(produk.harga_jual)}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Diskon</p>
                                        <p>{produk.diskon}%</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Harga Setelah Diskon</p>
                                    <p className="font-medium text-green-600">{formatCurrency(produk.harga_setelah_diskon)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Produk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {produk.gambar ? (
                                    <img
                                        src={`/storage/${produk.gambar}`}
                                        alt={produk.nama_barang}
                                        className="h-64 w-full rounded-lg object-contain"
                                    />
                                ) : (
                                    <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100">
                                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                {produk.gambar_deskripsi && produk.gambar_deskripsi.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Gambar Deskripsi</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-3 gap-2">
                                            {produk.gambar_deskripsi.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`/storage/${img.url}`}
                                                    alt={`Deskripsi ${index + 1}`}
                                                    className="h-32 w-full rounded-lg object-cover"
                                                />
                                            ))}
                                        </CardContent>
                                    </Card>
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
                                        <p className="text-sm text-gray-600">{produk.display ? 'Aktif' : 'Nonaktif'}</p>
                                    </div>
                                    {produk.display ? <Eye className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Produk Rekomendasi</p>
                                        <p className="text-sm text-gray-600">{produk.status_rekomendasi ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                    {produk.status_rekomendasi ? (
                                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    ) : (
                                        <Star className="h-5 w-5 text-gray-300" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Rating</p>
                                        <div className="flex items-center">
                                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            <span>{produk.average_rating.toFixed(1)}</span>
                                            <span className="ml-1 text-gray-500">({produk.feedbacks_count} ulasan)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Likes</p>
                                        <p className="text-sm text-gray-600">{produk.total_likes} orang menyukai</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Dibuat: {formatDate(produk.created_at)}</p>
                                    <p className="text-sm text-gray-600">Diperbarui: {formatDate(produk.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
