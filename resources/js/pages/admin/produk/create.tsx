import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    kategori: string[];
}

interface FormData {
    nama_barang: string;
    kode_barang: string;
    deskripsi: string;
    gambar: File | null;
    gambar_deskripsi: File[];
    stok: string;
    harga_beli: string;
    harga_jual: string;
    diskon: string;
    kategori: string;
    display: boolean;
    status_rekomendasi: boolean;
}

export default function ProdukCreate({ kategori }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<{ url: string; name: string }[]>([]);
    const [newKategori, setNewKategori] = useState('');
    const [useNewKategori, setUseNewKategori] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        nama_barang: '',
        kode_barang: '',
        deskripsi: '',
        gambar: null,
        gambar_deskripsi: [],
        stok: '0',
        harga_beli: '0',
        harga_jual: '0',
        diskon: '0',
        kategori: '',
        display: true,
        status_rekomendasi: false,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('gambar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = [...data.gambar_deskripsi, ...files];
            setData('gambar_deskripsi', newImages);

            const newPreviews = files.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            }));
            setPreviewImages([...previewImages, ...newPreviews]);
        }
    };

    const removeMainImage = () => {
        setData('gambar', null);
        setPreviewImage(null);
        const input = document.getElementById('gambar') as HTMLInputElement;
        if (input) input.value = '';
    };

    const removeAdditionalImage = (index: number) => {
        const newImages = [...data.gambar_deskripsi];
        newImages.splice(index, 1);
        setData('gambar_deskripsi', newImages);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const generateKodeBarang = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        setData('kode_barang', `PRD-${timestamp}${random}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalKategori = data.kategori || (useNewKategori ? newKategori.trim() : '');

        const formData = new FormData();
        formData.append('nama_barang', data.nama_barang);
        formData.append('kode_barang', data.kode_barang);
        formData.append('deskripsi', data.deskripsi);
        formData.append('stok', data.stok);
        formData.append('harga_beli', data.harga_beli);
        formData.append('harga_jual', data.harga_jual);
        formData.append('diskon', data.diskon);
        formData.append('kategori', finalKategori);
        formData.append('display', data.display ? '1' : '0');
        formData.append('status_rekomendasi', data.status_rekomendasi ? '1' : '0');

        if (data.gambar) {
            formData.append('gambar', data.gambar);
        }

        data.gambar_deskripsi.forEach((file, index) => {
            formData.append(`gambar_deskripsi[${index}]`, file);
        });

        post(route('admin.produk.kelola.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviewImage(null);
                setPreviewImages([]);
                setNewKategori('');
                setUseNewKategori(false);
            },
        });
    };

    const breadcrumbs = [
        { title: 'Kelola Produk', href: route('admin.produk.kelola') },
        { title: 'Tambahkan Produk', href: route('admin.produk.kelola.create') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />

            <div className="space-y-6 p-6">
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.produk.kelola')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
                        <p className="text-gray-600">Lengkapi informasi produk untuk menambahkan ke inventory</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Dasar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nama_barang">Nama Barang *</Label>
                                        <Input
                                            id="nama_barang"
                                            type="text"
                                            value={data.nama_barang}
                                            onChange={(e) => setData('nama_barang', e.target.value)}
                                            placeholder="Masukkan nama barang"
                                            className={errors.nama_barang ? 'border-red-500' : ''}
                                        />
                                        {errors.nama_barang && <p className="mt-1 text-sm text-red-500">{errors.nama_barang}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="kode_barang">Kode Barang *</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                id="kode_barang"
                                                type="text"
                                                value={data.kode_barang}
                                                onChange={(e) => setData('kode_barang', e.target.value)}
                                                placeholder="Masukkan kode barang"
                                                className={errors.kode_barang ? 'border-red-500' : ''}
                                            />
                                            <Button type="button" variant="outline" onClick={generateKodeBarang} className="whitespace-nowrap">
                                                Generate
                                            </Button>
                                        </div>
                                        {errors.kode_barang && <p className="mt-1 text-sm text-red-500">{errors.kode_barang}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="deskripsi">Deskripsi</Label>
                                        <Textarea
                                            id="deskripsi"
                                            value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            placeholder="Masukkan deskripsi produk"
                                            rows={4}
                                            className={errors.deskripsi ? 'border-red-500' : ''}
                                        />
                                        {errors.deskripsi && <p className="mt-1 text-sm text-red-500">{errors.deskripsi}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="stok">Stok *</Label>
                                        <Input
                                            id="stok"
                                            type="number"
                                            min="0"
                                            value={data.stok}
                                            onChange={(e) => setData('stok', e.target.value)}
                                            placeholder="0"
                                            className={errors.stok ? 'border-red-500' : ''}
                                        />
                                        {errors.stok && <p className="mt-1 text-sm text-red-500">{errors.stok}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Kategori</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch id="use-new-kategori" checked={useNewKategori} onCheckedChange={setUseNewKategori} />
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
                                            {!newKategori.trim() && <p className="mt-1 text-sm text-red-500">Kategori baru tidak boleh kosong</p>}
                                        </div>
                                    ) : (
                                        <div>
                                            <Label htmlFor="kategori">Pilih Kategori</Label>
                                            <Select value={data.kategori} onValueChange={(value) => setData('kategori', value)}>
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
                                            {errors.kategori && <p className="mt-1 text-sm text-red-500">{errors.kategori}</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Keuangan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="harga_beli">Harga Beli *</Label>
                                            <Input
                                                id="harga_beli"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.harga_beli}
                                                onChange={(e) => setData('harga_beli', e.target.value)}
                                                placeholder="0"
                                                className={errors.harga_beli ? 'border-red-500' : ''}
                                            />
                                            {errors.harga_beli && <p className="mt-1 text-sm text-red-500">{errors.harga_beli}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="harga_jual">Harga Jual *</Label>
                                            <Input
                                                id="harga_jual"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.harga_jual}
                                                onChange={(e) => setData('harga_jual', e.target.value)}
                                                placeholder="0"
                                                className={errors.harga_jual ? 'border-red-500' : ''}
                                            />
                                            {errors.harga_jual && <p className="mt-1 text-sm text-red-500">{errors.harga_jual}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="diskon">Diskon (%)</Label>
                                        <Input
                                            id="diskon"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.diskon}
                                            onChange={(e) => setData('diskon', e.target.value)}
                                            placeholder="0"
                                            className={errors.diskon ? 'border-red-500' : ''}
                                        />
                                        {errors.diskon && <p className="mt-1 text-sm text-red-500">{errors.diskon}</p>}

                                        {parseFloat(data.harga_jual) > 0 && parseFloat(data.diskon) > 0 && (
                                            <div className="mt-2 rounded-lg bg-gray-50 p-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p className="text-sm">Harga Normal:</p>
                                                    <p className="text-right text-sm">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        }).format(parseFloat(data.harga_jual))}
                                                    </p>

                                                    <p className="text-sm">Diskon:</p>
                                                    <p className="text-right text-sm text-red-600">
                                                        -
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        }).format((parseFloat(data.harga_jual) * parseFloat(data.diskon)) / 100)}
                                                    </p>

                                                    <p className="text-sm font-medium">Harga Setelah Diskon:</p>
                                                    <p className="text-right text-sm font-medium text-green-600">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        }).format(parseFloat(data.harga_jual) * (1 - parseFloat(data.diskon) / 100))}
                                                    </p>

                                                    <p className="text-sm">Margin:</p>
                                                    <p className="text-right text-sm">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        }).format(
                                                            parseFloat(data.harga_jual) * (1 - parseFloat(data.diskon) / 100) -
                                                                parseFloat(data.harga_beli),
                                                        )}
                                                    </p>

                                                    <p className="text-sm">Margin (%)</p>
                                                    <p className="text-right text-sm">
                                                        {(
                                                            ((parseFloat(data.harga_jual) * (1 - parseFloat(data.diskon) / 100) -
                                                                parseFloat(data.harga_beli)) /
                                                                parseFloat(data.harga_beli)) *
                                                            100
                                                        ).toFixed(2)}
                                                        %
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gambar Produk</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Gambar Utama</Label>
                                        <div className="mt-2">
                                            {previewImage ? (
                                                <div className="relative">
                                                    <img src={previewImage} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
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
                                                <label htmlFor="gambar" className="block">
                                                    <div className="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                                                        <div className="text-center">
                                                            <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                                            <p className="text-sm text-gray-600">Klik untuk upload gambar utama</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG, GIF hingga 2MB</p>
                                                        </div>
                                                    </div>
                                                    <input id="gambar" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                        {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
                                    </div>

                                    <div>
                                        <Label>Gambar Deskripsi</Label>
                                        <div className="mt-2">
                                            <label htmlFor="gambar_deskripsi" className="block">
                                                <div className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8 hover:border-gray-400">
                                                    <div className="text-center">
                                                        <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                                        <p className="text-sm text-gray-600">Tambah gambar deskripsi</p>
                                                        <p className="text-xs text-gray-400">PNG, JPG, GIF hingga 2MB</p>
                                                    </div>
                                                </div>
                                                <input
                                                    id="gambar_deskripsi"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleMultipleImageChange}
                                                    className="hidden"
                                                    multiple
                                                />
                                                {errors.gambar_deskripsi && <p className="mt-1 text-sm text-red-500">{errors.gambar_deskripsi}</p>}
                                            </label>
                                        </div>

                                        {previewImages.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                {previewImages.map((preview, index) => (
                                                    <div key={index} className="group relative">
                                                        <img src={preview.url} alt={preview.name} className="h-24 w-full rounded-lg object-cover" />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeAdditionalImage(index)}
                                                            className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
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
                                            <p className="text-sm text-gray-500">Produk akan ditampilkan kepada pelanggan</p>
                                        </div>
                                        <Switch id="display" checked={data.display} onCheckedChange={(checked) => setData('display', checked)} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="status_rekomendasi">Produk Rekomendasi</Label>
                                            <p className="text-sm text-gray-500">Produk akan muncul di bagian rekomendasi</p>
                                        </div>
                                        <Switch
                                            id="status_rekomendasi"
                                            checked={data.status_rekomendasi}
                                            onCheckedChange={(checked) => setData('status_rekomendasi', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex space-x-2">
                                <Button type="submit" disabled={processing || (useNewKategori && !newKategori.trim())} className="flex-1">
                                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                </Button>
                                <Link href={route('admin.produk.kelola')}>
                                    <Button type="button" variant="outline">
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
