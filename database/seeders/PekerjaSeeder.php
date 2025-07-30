<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pekerja;
use Illuminate\Support\Str;

class PekerjaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pekerjas = [
            [
                'nama_pekerja' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@anekasaranateknik.com',
                'telepon' => '081234567890',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'jabatan' => 'Teknisi AC Senior',
                'spesialis' => 'AC Split, AC Cassette, AC Central',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/ahmad-rizki.jpg',
                'slug' => 'ahmad-rizki',
                'deskripsi' => 'Teknisi AC berpengalaman 8 tahun dengan sertifikasi resmi dari berbagai brand AC ternama. Spesialisasi dalam instalasi dan maintenance AC split.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Budi Santoso',
                'email' => 'budi.santoso@anekasaranateknik.com',
                'telepon' => '081234567891',
                'alamat' => 'Jl. Thamrin No. 45, Jakarta Pusat',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Window',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/budi-santoso.jpg',
                'slug' => 'budi-santoso',
                'deskripsi' => 'Teknisi AC dengan pengalaman 5 tahun. Ahli dalam service dan perbaikan AC split berbagai merk.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Citra Dewi',
                'email' => 'citra.dewi@anekasaranateknik.com',
                'telepon' => '081234567892',
                'alamat' => 'Jl. Gatot Subroto No. 67, Jakarta Selatan',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Portable',
                'status' => 'busy',
                'busy_mulai' => '2024-01-15',
                'busy_selesai' => '2024-01-20',
                'foto' => 'pekerja/citra-dewi.jpg',
                'slug' => 'citra-dewi',
                'deskripsi' => 'Teknisi AC wanita dengan pengalaman 4 tahun. Spesialisasi dalam AC portable dan AC split kecil.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Dedi Kurniawan',
                'email' => 'dedi.kurniawan@anekasaranateknik.com',
                'telepon' => '081234567893',
                'alamat' => 'Jl. Hayam Wuruk No. 89, Jakarta Barat',
                'jabatan' => 'Teknisi AC Senior',
                'spesialis' => 'AC Central, AC VRV, AC Chiller',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/dedi-kurniawan.jpg',
                'slug' => 'dedi-kurniawan',
                'deskripsi' => 'Teknisi AC senior dengan pengalaman 12 tahun. Ahli dalam sistem AC central dan VRV untuk gedung komersial.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Eko Prasetyo',
                'email' => 'eko.prasetyo@anekasaranateknik.com',
                'telepon' => '081234567894',
                'alamat' => 'Jl. Mangga Dua No. 12, Jakarta Utara',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Cassette',
                'status' => 'off',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/eko-prasetyo.jpg',
                'slug' => 'eko-prasetyo',
                'deskripsi' => 'Teknisi AC dengan pengalaman 6 tahun. Spesialisasi dalam AC cassette dan AC split untuk ruangan komersial.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Fajar Ramadhan',
                'email' => 'fajar.ramadhan@anekasaranateknik.com',
                'telepon' => '081234567895',
                'alamat' => 'Jl. Senayan No. 34, Jakarta Selatan',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Window, AC Portable',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/fajar-ramadhan.jpg',
                'slug' => 'fajar-ramadhan',
                'deskripsi' => 'Teknisi AC muda dengan pengalaman 3 tahun. Aktif dan responsif dalam menangani service AC.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Gunawan Setiawan',
                'email' => 'gunawan.setiawan@anekasaranateknik.com',
                'telepon' => '081234567896',
                'alamat' => 'Jl. Kebon Jeruk No. 56, Jakarta Barat',
                'jabatan' => 'Teknisi AC Senior',
                'spesialis' => 'AC Split, AC Central, AC VRV',
                'status' => 'busy',
                'busy_mulai' => '2024-01-18',
                'busy_selesai' => '2024-01-25',
                'foto' => 'pekerja/gunawan-setiawan.jpg',
                'slug' => 'gunawan-setiawan',
                'deskripsi' => 'Teknisi AC senior dengan pengalaman 10 tahun. Spesialisasi dalam sistem AC central dan VRV untuk proyek besar.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Hendra Wijaya',
                'email' => 'hendra.wijaya@anekasaranateknik.com',
                'telepon' => '081234567897',
                'alamat' => 'Jl. Kelapa Gading No. 78, Jakarta Utara',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Cassette',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/hendra-wijaya.jpg',
                'slug' => 'hendra-wijaya',
                'deskripsi' => 'Teknisi AC dengan pengalaman 7 tahun. Ahli dalam instalasi dan maintenance AC split dan cassette.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Indra Kusuma',
                'email' => 'indra.kusuma@anekasaranateknik.com',
                'telepon' => '081234567898',
                'alamat' => 'Jl. Blok M No. 90, Jakarta Selatan',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Window',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/indra-kusuma.jpg',
                'slug' => 'indra-kusuma',
                'deskripsi' => 'Teknisi AC dengan pengalaman 5 tahun. Spesialisasi dalam service dan perbaikan AC split dan window.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Joko Widodo',
                'email' => 'joko.widodo@anekasaranateknik.com',
                'telepon' => '081234567899',
                'alamat' => 'Jl. Cikini No. 23, Jakarta Pusat',
                'jabatan' => 'Teknisi AC Senior',
                'spesialis' => 'AC Split, AC Central, AC Chiller',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/joko-widodo.jpg',
                'slug' => 'joko-widodo',
                'deskripsi' => 'Teknisi AC senior dengan pengalaman 15 tahun. Ahli dalam sistem AC central dan chiller untuk industri.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Kartika Sari',
                'email' => 'kartika.sari@anekasaranateknik.com',
                'telepon' => '081234567800',
                'alamat' => 'Jl. Kemang No. 45, Jakarta Selatan',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Portable',
                'status' => 'off',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/kartika-sari.jpg',
                'slug' => 'kartika-sari',
                'deskripsi' => 'Teknisi AC wanita dengan pengalaman 4 tahun. Spesialisasi dalam AC portable dan AC split untuk rumah tangga.',
                'display' => true,
                'jasa_id' => null
            ],
            [
                'nama_pekerja' => 'Lukman Hakim',
                'email' => 'lukman.hakim@anekasaranateknik.com',
                'telepon' => '081234567801',
                'alamat' => 'Jl. Tanah Abang No. 67, Jakarta Pusat',
                'jabatan' => 'Teknisi AC',
                'spesialis' => 'AC Split, AC Cassette',
                'status' => 'standby',
                'busy_mulai' => null,
                'busy_selesai' => null,
                'foto' => 'pekerja/lukman-hakim.jpg',
                'slug' => 'lukman-hakim',
                'deskripsi' => 'Teknisi AC dengan pengalaman 6 tahun. Ahli dalam instalasi dan maintenance AC split dan cassette.',
                'display' => true,
                'jasa_id' => null
            ]
        ];

        foreach ($pekerjas as $pekerja) {
            Pekerja::create($pekerja);
        }

        $this->command->info('Pekerja seeder completed successfully!');
    }
} 