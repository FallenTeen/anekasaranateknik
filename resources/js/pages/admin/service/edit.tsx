import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

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
}

interface Props {
    jasa: Jasa;
    kategori: string[];
}

export default function ServiceEdit({ jasa, kategori }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [newKategori, setNewKategori] = useState('');
    const [useNewKategori, setUseNewKategori] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nama_jasa: jasa.nama_jasa,
        kode_jasa: jasa.kode_jasa,
        deskripsi: jasa.deskripsi || '',
        foto: null as File | null,
        snk: jasa.snk || '',
        harga: jasa.harga.toString(),
        kategori: jasa.kategori || '',
        display: jasa.display,
        status_rekomendasi: jasa.status_rekomendasi,
        delete_photo: false,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setData('delete_photo', false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMainImage = () => {
        setData('foto', null);
        setData('delete_photo', true);
        setPreviewImage(null);
        const input = document.getElementById('foto') as HTMLInputElement;
        if (input) input.value = '';
    };

    const generateKodeJasa = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        setData('kode_jasa', `JAS-${timestamp}${random}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalKategori = data.kategori || (useNewKategori ? newKategori.trim() : '');

        const formData = new FormData();
        formData.append('nama_jasa', data.nama_jasa);
        formData.append('kode_jasa', data.kode_jasa);
        formData.append('deskripsi', data.deskripsi);
        formData.append('snk', data.snk);
        formData.append('harga', data.harga);
        formData.append('kategori', finalKategori);
        formData.append('display', data.display ? '1' : '0');
        formData.append('status_rekomendasi', data.status_rekomendasi ? '1' : '0');
        formData.append('_method', 'put');

        if (data.foto) {
            formData.append('foto', data.foto);
        }

        if (data.delete_photo) {
            formData.append('delete_photo', '1');
        }

        post(route('admin.services.jasa.update', jasa.id), {
            data: formData,
            forceFormData: true,
        });
    };

    const breadcrumbs = [
        { title: 'Manajemen Jasa', href: route('admin.services.jasa') },
        { title: 'Edit Jasa', href: route('admin.services.jasa.edit', jasa.id) },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Jasa - ${jasa.nama_jasa}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.services.jasa')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Jasa</h1>
                        <p className="text-gray-600">Perbarui informasi jasa</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Dasar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nama_jasa">Nama Jasa *</Label>
                                        <Input
                                            id="nama_jasa"
                                            type="text"
                                            value={data.nama_jasa}
                                            onChange={(e) => setData('nama_jasa', e.target.value)}
                                            placeholder="Masukkan nama jasa"
                                            className={errors.nama_jasa ? 'border-red-500' : ''}
                                        />
                                        {errors.nama_jasa && (
                                            <p className="text-sm text-red-500 mt-1">{errors.nama_jasa}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="kode_jasa">Kode Jasa *</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="kode_jasa"
                                                type="text"
                                                value={data.kode_jasa}
                                                onChange={(e) => setData('kode_jasa', e.target.value)}
                                                placeholder="Masukkan kode jasa"
                                                className={errors.kode_jasa ? 'border-red-500' : ''}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={generateKodeJasa}
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                        {errors.kode_jasa && (
                                            <p className="text-sm text-red-500 mt-1">{errors.kode_jasa}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="deskripsi">Deskripsi</Label>
                                        <Textarea
                                            id="deskripsi"
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            placeholder="Masukkan deskripsi jasa"
                                            rows={4}
                                            className={errors.deskripsi ? 'border-red-500' : ''}
                                        />
                                        {errors.deskripsi && (
                                            <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="snk">Syarat dan Ketentuan</Label>
                                        <Textarea
                                            id="snk"
                                            value={data.snk}
                                            onChange={(e) => setData('snk', e.target.value)}
                                            placeholder="Masukkan syarat dan ketentuan"
                                            rows={4}
                                            className={errors.snk ? 'border-red-500' : ''}
                                        />
                                        {errors.snk && (
                                            <p className="text-sm text-red-500 mt-1">{errors.snk}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Kategori</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="use-new-kategori"
                                            checked={useNewKategori}
                                            onCheckedChange={setUseNewKategori}
                                        />
                                        <Label htmlFor="use-new-kategori">Buat kategori baru</Label>
                                    </div>

                                    {useNewKategori ? (
                                        <div>
                                            <Label htmlFor="new_kategori">Kategori Baru</Label>
                                            <Input
                                                id="new_kategori"
                                                type="text"
                                                value={newKategori}
                                                onChange={(e) => {
                                                    setNewKategori(e.target.value);
                                                    setData('kategori', e.target.value);
                                                }}
                                                placeholder="Masukkan kategori baru"
                                            />
                                            {!newKategori.trim() && (
                                                <p className="text-sm text-red-500 mt-1">Kategori baru tidak boleh kosong</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <Label htmlFor="kategori">Pilih Kategori</Label>
                                            <Select
                                                value={data.kategori}
                                                onValueChange={(value) => setData('kategori', value)}
                                            >
                                                <SelectTrigger className={errors.kategori ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {kategori.map((kat) => (
                                                        <SelectItem key={kat} value={kat}>
                                                            {kat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.kategori && (
                                                <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>
                                            )}
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
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Gambar Utama</Label>
                                        <div className="mt-2">
                                            {previewImage ? (
                                                <div className="relative">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeMainImage}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : jasa.foto && !data.delete_photo ? (
                                                <div className="relative">
                                                    <img
                                                        src={`/storage/${jasa.foto}`}
                                                        alt={jasa.nama_jasa}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeMainImage}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label htmlFor="foto" className="block">
                                                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                                                        <div className="text-center">
                                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-600">Klik untuk upload gambar utama</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG, GIF hingga 2MB</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        id="foto"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {errors.foto && (
                                            <p className="text-sm text-red-500 mt-1">{errors.foto}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Harga</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label htmlFor="harga">Harga *</Label>
                                        <Input
                                            id="harga"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.harga}
                                            onChange={(e) => setData('harga', e.target.value)}
                                            placeholder="0"
                                            className={errors.harga ? 'border-red-500' : ''}
                                        />
                                        {errors.harga && (
                                            <p className="text-sm text-red-500 mt-1">{errors.harga}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pengaturan Tampilan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="display">Tampilkan di Toko</Label>
                                            <p className="text-sm text-gray-500">
                                                Jasa akan ditampilkan kepada pelanggan
                                            </p>
                                        </div>
                                        <Switch
                                            id="display"
                                            checked={data.display}
                                            onCheckedChange={(checked) => setData('display', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="status_rekomendasi">Jasa Rekomendasi</Label>
                                            <p className="text-sm text-gray-500">
                                                Jasa akan muncul di bagian rekomendasi
                                            </p>
                                        </div>
                                        <Switch
                                            id="status_rekomendasi"
                                            checked={data.status_rekomendasi}
                                            onCheckedChange={(checked) => setData('status_rekomendasi', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing || (useNewKategori && !newKategori.trim())}
                                >
                                    {processing ? 'Menyimpan...' : 'Perbarui Jasa'}
                                </Button>

                                <Link href={route('admin.services.jasa')} className="block">
                                    <Button variant="outline" className="w-full">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
