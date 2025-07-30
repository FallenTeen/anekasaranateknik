<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksi = Transaksi::with(['user:id,name,email'])
            ->select([
                'id', 'kode_transaksi', 'user_id', 'total_bayar',
                'status', 'metode_pembayaran', 'batas_pembayaran',
                'bukti_pembayaran', 'created_at'
            ])
            ->whereIn('status', ['menunggu_pembayaran', 'dibayar', 'diproses'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->is_expired = $item->isExpired();
                $item->status_label = $item->status_label;
                $item->status_badge_color = $item->status_badge_color;
                return $item;
            });

        $statistik = [
            'total_transaksi' => Transaksi::count(),
            'menunggu_pembayaran' => Transaksi::where('status', 'menunggu_pembayaran')->count(),
            'dibayar' => Transaksi::where('status', 'dibayar')->count(),
            'diproses' => Transaksi::where('status', 'diproses')->count(),
            'selesai' => Transaksi::where('status', 'selesai')->count(),
            'expired' => Transaksi::expired()->count(),
        ];

        return Inertia::render('admin/transaksi/index', [
            'transaksi' => $transaksi,
            'statistik' => $statistik,
        ]);
    }

    public function show($id)
    {
        $transaksi = Transaksi::with(['user:id,name,email,created_at'])
            ->findOrFail($id);

        $transaksi->is_expired = $transaksi->isExpired();
        $transaksi->status_label = $transaksi->status_label;
        $transaksi->status_badge_color = $transaksi->status_badge_color;
        $transaksi->can_be_processed = $transaksi->canBeProcessed();

        return Inertia::render('admin/transaksi/show', [
            'transaksi' => $transaksi,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:dibayar,diproses,selesai,dibatalkan',
            'catatan_admin' => 'nullable|string|max:500',
        ]);

        $oldStatus = $transaksi->status;
        $newStatus = $validated['status'];

        DB::transaction(function () use ($transaksi, $validated, $oldStatus, $newStatus) {
            $updateData = [
                'status' => $newStatus,
                'catatan_admin' => $validated['catatan_admin'] ?? null,
            ];

            switch ($newStatus) {
                case 'dibayar':
                    $updateData['dibayar_pada'] = Carbon::now();
                    break;
                case 'diproses':
                    $updateData['diproses_pada'] = Carbon::now();
                    break;
                case 'selesai':
                    $updateData['selesai_pada'] = Carbon::now();
                    break;
            }

            $transaksi->update($updateData);

            Notifikasi::create([
                'type' => 'transaction_status_updated',
                'judul' => 'Status Transaksi Diperbarui',
                'pesan' => "Transaksi {$transaksi->kode_transaksi} status berubah dari {$oldStatus} ke {$newStatus}",
                'data' => [
                    'transaksi_id' => $transaksi->id,
                    'kode_transaksi' => $transaksi->kode_transaksi,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'user_id' => $transaksi->user_id,
                    'user_name' => $transaksi->user->name,
                ],
            ]);
        });

        return redirect()->back()->with('success', 'Status transaksi berhasil diperbarui');
    }

    public function riwayat()
    {
        $transaksi = Transaksi::with(['user:id,name,email'])
            ->select([
                'id', 'kode_transaksi', 'user_id', 'total_bayar',
                'status', 'metode_pembayaran', 'dibayar_pada', 'selesai_pada',
                'diproses_pada', 'created_at', 'catatan_admin'
            ])
            ->whereIn('status', ['selesai', 'dibatalkan'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'kode_transaksi' => $item->kode_transaksi,
                    'user_id' => $item->user_id,
                    'user' => $item->user,
                    'total_bayar' => $item->total_bayar,
                    'status' => $item->status,
                    'metode_pembayaran' => $item->metode_pembayaran,
                    'dibayar_pada' => $item->dibayar_pada,
                    'selesai_pada' => $item->selesai_pada,
                    'diproses_pada' => $item->diproses_pada,
                    'created_at' => $item->created_at,
                    'catatan_admin' => $item->catatan_admin,
                    'status_label' => $item->status_label,
                    'status_badge_color' => $item->status_badge_color,
                ];
            });

        $statistik = [
            'total_selesai' => Transaksi::where('status', 'selesai')->count(),
            'total_dibatalkan' => Transaksi::where('status', 'dibatalkan')->count(),
            'total_pendapatan' => (float) Transaksi::where('status', 'selesai')->sum('total_bayar'),
            'pendapatan_bulan_ini' => (float) Transaksi::where('status', 'selesai')
                ->whereMonth('selesai_pada', Carbon::now()->month)
                ->whereYear('selesai_pada', Carbon::now()->year)
                ->sum('total_bayar'),
            'pendapatan_hari_ini' => (float) Transaksi::where('status', 'selesai')
                ->whereDate('selesai_pada', Carbon::today())
                ->sum('total_bayar'),
            'rata_rata_transaksi' => (float) Transaksi::where('status', 'selesai')
                ->avg('total_bayar'),
        ];

        $chartData = [
            'pendapatan_harian' => $this->getPendapatanHarian(),
            'transaksi_bulanan' => $this->getTransaksiBulanan(),
        ];

        return Inertia::render('admin/transaksi/riwayat', [
            'transaksi' => $transaksi,
            'statistik' => $statistik,
            'chartData' => $chartData,
        ]);
    }

    private function getPendapatanHarian()
    {
        return Transaksi::where('status', 'selesai')
            ->where('selesai_pada', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(selesai_pada) as tanggal, SUM(total_bayar) as total')
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => Carbon::parse($item->tanggal)->format('d/m'),
                    'total' => (float) $item->total,
                ];
            });
    }

    private function getTransaksiBulanan()
    {
        return Transaksi::selectRaw('
                MONTH(created_at) as bulan,
                YEAR(created_at) as tahun,
                COUNT(CASE WHEN status = "selesai" THEN 1 END) as selesai,
                COUNT(CASE WHEN status = "dibatalkan" THEN 1 END) as dibatalkan
            ')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('tahun', 'bulan')
            ->orderBy('tahun')
            ->orderBy('bulan')
            ->get()
            ->map(function ($item) {
                return [
                    'periode' => Carbon::createFromDate($item->tahun, $item->bulan, 1)->format('M Y'),
                    'selesai' => $item->selesai,
                    'dibatalkan' => $item->dibatalkan,
                ];
            });
    }

    public function export(Request $request)
    {
        $query = Transaksi::with(['user:id,name,email'])
            ->whereIn('status', ['selesai', 'dibatalkan']);

        if ($request->has('bulan') && $request->bulan) {
            $bulan = Carbon::createFromFormat('Y-m', $request->bulan);
            $query->whereMonth('created_at', $bulan->month)
                  ->whereYear('created_at', $bulan->year);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $transaksi = $query->orderBy('created_at', 'desc')->get();

        $filename = 'riwayat_transaksi_' . Carbon::now()->format('Y_m_d_H_i_s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename={$filename}",
            'Cache-Control' => 'no-cache, must-revalidate',
        ];

        $callback = function() use ($transaksi) {
            $file = fopen('php://output', 'w');

            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'Kode Transaksi',
                'Nama Customer',
                'Email Customer',
                'Total Bayar',
                'Status',
                'Metode Pembayaran',
                'Tanggal Transaksi',
                'Tanggal Dibayar',
                'Tanggal Selesai',
                'Catatan Admin'
            ]);

            foreach ($transaksi as $row) {
                fputcsv($file, [
                    $row->kode_transaksi,
                    $row->user->name ?? '-',
                    $row->user->email ?? '-',
                    number_format($row->total_bayar, 0, ',', '.'),
                    $row->status_label,
                    ucfirst(str_replace('_', ' ', $row->metode_pembayaran ?? '-')),
                    $row->created_at->format('d/m/Y H:i'),
                    $row->dibayar_pada ? $row->dibayar_pada->format('d/m/Y H:i') : '-',
                    $row->selesai_pada ? $row->selesai_pada->format('d/m/Y H:i') : '-',
                    $row->catatan_admin ?? '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
