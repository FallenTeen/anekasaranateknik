<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Barang;
use Illuminate\Support\Str;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangs = [
            // AC Products
            [
                'nama_barang' => 'AC Split 1 PK Daikin',
                'kode_barang' => 'AC-DAIKIN-1PK',
                'deskripsi' => 'AC Split 1 PK Daikin dengan teknologi inverter yang hemat energi. Cocok untuk ruangan 12-18 m².',
                'gambar' => 'barang/AC-DAIKIN.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-DAIKIN.png', 'caption' => 'AC Daikin 1 PK'],
                    ['url' => 'barang/AC-DAIKIN-2.png', 'caption' => 'Indoor Unit']
                ]),
                'display' => true,
                'status_rekomendasi' => true,
                'stok' => '15',
                'slug' => 'ac-split-1-pk-daikin',
                'harga_beli' => 2500000,
                'harga_jual' => 3200000,
                'diskon' => 10.00,
                'kategori' => 'AC'
            ],
            [
                'nama_barang' => 'AC Split 1.5 PK LG',
                'kode_barang' => 'AC-LG-1.5PK',
                'deskripsi' => 'AC Split 1.5 PK LG dengan fitur dual inverter dan anti bakteri. Ideal untuk ruangan 18-24 m².',
                'gambar' => 'barang/AC-LG.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-LG.png', 'caption' => 'AC LG 1.5 PK'],
                    ['url' => 'barang/AC-LG-2.png', 'caption' => 'Outdoor Unit']
                ]),
                'display' => true,
                'status_rekomendasi' => true,
                'stok' => '12',
                'slug' => 'ac-split-1-5-pk-lg',
                'harga_beli' => 2800000,
                'harga_jual' => 3600000,
                'diskon' => 8.00,
                'kategori' => 'AC'
            ],
            [
                'nama_barang' => 'AC Split 2 PK Mitsubishi',
                'kode_barang' => 'AC-MITSUBISHI-2PK',
                'deskripsi' => 'AC Split 2 PK Mitsubishi dengan teknologi inverter dan filter anti alergi. Cocok untuk ruangan 24-36 m².',
                'gambar' => 'barang/AC-Mitsubishi.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-Mitsubishi.png', 'caption' => 'AC Mitsubishi 2 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '8',
                'slug' => 'ac-split-2-pk-mitsubishi',
                'harga_beli' => 3500000,
                'harga_jual' => 4500000,
                'diskon' => 5.00,
                'kategori' => 'AC'
            ],
            [
                'nama_barang' => 'AC Split 1 PK Panasonic',
                'kode_barang' => 'AC-PANASONIC-1PK',
                'deskripsi' => 'AC Split 1 PK Panasonic dengan nanoe technology dan eco mode. Hemat energi untuk ruangan 12-18 m².',
                'gambar' => 'barang/AC-Panasonic.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-Panasonic.png', 'caption' => 'AC Panasonic 1 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '20',
                'slug' => 'ac-split-1-pk-panasonic',
                'harga_beli' => 2400000,
                'harga_jual' => 3100000,
                'diskon' => 12.00,
                'kategori' => 'AC'
            ],
            [
                'nama_barang' => 'AC Split 1 PK Samsung',
                'kode_barang' => 'AC-SAMSUNG-1PK',
                'deskripsi' => 'AC Split 1 PK Samsung dengan windfree technology dan smart diagnosis. Nyaman untuk ruangan 12-18 m².',
                'gambar' => 'barang/AC-SAMSUNG.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-SAMSUNG.png', 'caption' => 'AC Samsung 1 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '10',
                'slug' => 'ac-split-1-pk-samsung',
                'harga_beli' => 2300000,
                'harga_jual' => 3000000,
                'diskon' => 15.00,
                'kategori' => 'AC'
            ],
            [
                'nama_barang' => 'AC Split 1 PK Sharp',
                'kode_barang' => 'AC-SHARP-1PK',
                'deskripsi' => 'AC Split 1 PK Sharp dengan plasmacluster technology dan inverter. Bersih dan sehat untuk ruangan 12-18 m².',
                'gambar' => 'barang/AC-Sharp.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/AC-Sharp.png', 'caption' => 'AC Sharp 1 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '18',
                'slug' => 'ac-split-1-pk-sharp',
                'harga_beli' => 2200000,
                'harga_jual' => 2900000,
                'diskon' => 8.00,
                'kategori' => 'AC'
            ],

            // AC Additional Products
            [
                'nama_barang' => 'Bracket AC Universal',
                'kode_barang' => 'BRACKET-AC-UNIV',
                'deskripsi' => 'Bracket AC universal untuk indoor unit. Terbuat dari besi galvanis anti karat dengan ketebalan 2mm.',
                'gambar' => 'barang/bracket-ac.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/bracket-ac.png', 'caption' => 'Bracket AC Universal']
                ]),
                'display' => true,
                'status_rekomendasi' => true,
                'stok' => '50',
                'slug' => 'bracket-ac-universal',
                'harga_beli' => 150000,
                'harga_jual' => 250000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Filter AC 1 PK',
                'kode_barang' => 'FILTER-AC-1PK',
                'deskripsi' => 'Filter AC untuk 1 PK berbagai merk. Terbuat dari bahan berkualitas untuk menyaring debu dan kotoran.',
                'gambar' => 'barang/Filter-AC1.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Filter-AC1.png', 'caption' => 'Filter AC 1 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '100',
                'slug' => 'filter-ac-1-pk',
                'harga_beli' => 25000,
                'harga_jual' => 45000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Filter AC 1.5 PK',
                'kode_barang' => 'FILTER-AC-1.5PK',
                'deskripsi' => 'Filter AC untuk 1.5 PK berbagai merk. Ukuran lebih besar untuk AC dengan kapasitas lebih tinggi.',
                'gambar' => 'barang/Filter-AC2.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Filter-AC2.png', 'caption' => 'Filter AC 1.5 PK']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '80',
                'slug' => 'filter-ac-1-5-pk',
                'harga_beli' => 30000,
                'harga_jual' => 55000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Freon R32 1 KG',
                'kode_barang' => 'FREON-R32-1KG',
                'deskripsi' => 'Freon R32 untuk AC inverter modern. Ramah lingkungan dan efisien energi.',
                'gambar' => 'barang/Freon.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Freon.png', 'caption' => 'Freon R32 1 KG']
                ]),
                'display' => true,
                'status_rekomendasi' => true,
                'stok' => '30',
                'slug' => 'freon-r32-1-kg',
                'harga_beli' => 80000,
                'harga_jual' => 120000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Pompa Vakum AC',
                'kode_barang' => 'POMPA-VAKUM-AC',
                'deskripsi' => 'Pompa vakum untuk service AC. Kualitas tinggi untuk hasil vakum yang optimal.',
                'gambar' => 'barang/Pompa-vakum.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Pompa-vakum.png', 'caption' => 'Pompa Vakum AC']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '15',
                'slug' => 'pompa-vakum-ac',
                'harga_beli' => 500000,
                'harga_jual' => 750000,
                'diskon' => 5.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Remote AC Universal',
                'kode_barang' => 'REMOTE-AC-UNIV',
                'deskripsi' => 'Remote AC universal untuk berbagai merk. Kompatibel dengan kebanyakan AC split.',
                'gambar' => 'barang/Remote-substitusi-universal.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Remote-substitusi-universal.png', 'caption' => 'Remote AC Universal']
                ]),
                'display' => true,
                'status_rekomendasi' => true,
                'stok' => '25',
                'slug' => 'remote-ac-universal',
                'harga_beli' => 75000,
                'harga_jual' => 120000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ],
            [
                'nama_barang' => 'Saklar AC',
                'kode_barang' => 'SAKLAR-AC',
                'deskripsi' => 'Saklar AC untuk kontrol power. Kualitas tinggi dengan safety protection.',
                'gambar' => 'barang/Saklar-AC.png',
                'gambar_deskripsi' => json_encode([
                    ['url' => 'barang/Saklar-AC.png', 'caption' => 'Saklar AC']
                ]),
                'display' => true,
                'status_rekomendasi' => false,
                'stok' => '40',
                'slug' => 'saklar-ac',
                'harga_beli' => 45000,
                'harga_jual' => 75000,
                'diskon' => 0.00,
                'kategori' => 'Produk Tambahan AC'
            ]
        ];

        foreach ($barangs as $barang) {
            Barang::create($barang);
        }

        $this->command->info('Barang seeder completed successfully!');
    }
} 