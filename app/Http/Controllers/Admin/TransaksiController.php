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
                'status', 'metode_pembayaran', 'selesai_pada',
                'dibatalkan_pada', 'created_at'
            ])
            ->whereIn('status', ['selesai', 'dibatalkan'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->status_label = $item->status_label;
                $item->status_badge_color = $item->status_badge_color;
                return $item;
            });

        $statistik = [
            'total_selesai' => Transaksi::where('status', 'selesai')->count(),
            'total_dibatalkan' => Transaksi::where('status', 'dibatalkan')->count(),
            'total_pendapatan' => Transaksi::where('status', 'selesai')->sum('total_bayar'),
            'pendapatan_bulan_ini' => Transaksi::where('status', 'selesai')
                ->whereMonth('selesai_pada', Carbon::now()->month)
                ->whereYear('selesai_pada', Carbon::now()->year)
                ->sum('total_bayar'),
        ];

        return Inertia::render('admin/transaksi/riwayat', [
            'transaksi' => $transaksi,
            'statistik' => $statistik,
        ]);
    }

    public function export()
    {
        $transaksi = Transaksi::with(['user:id,name,email'])
            ->whereIn('status', ['selesai', 'dibatalkan'])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'riwayat_transaksi_' . Carbon::now()->format('Y_m_d_H_i_s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $callback = function() use ($transaksi) {
            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'Kode Transaksi',
                'Nama Customer',
                'Email Customer',
                'Total Bayar',
                'Status',
                'Metode Pembayaran',
                'Tanggal Transaksi',
                'Tanggal Selesai'
            ]);

            foreach ($transaksi as $row) {
                fputcsv($file, [
                    $row->kode_transaksi,
                    $row->user->name,
                    $row->user->email,
                    $row->total_bayar,
                    $row->status_label,
                    $row->metode_pembayaran,
                    $row->created_at->format('d/m/Y H:i'),
                    $row->selesai_pada ? $row->selesai_pada->format('d/m/Y H:i') : '-'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
