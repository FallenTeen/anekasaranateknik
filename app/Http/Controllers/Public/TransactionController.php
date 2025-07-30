<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Keranjang;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function checkout()
    {
        $user = Auth::user();
        $cartItems = Keranjang::with(['barang' => function($query) {
            $query->where('display', true);
        }])
        ->where('user_id', $user->id)
        ->get()
        ->filter(function($item) {
            return $item->barang !== null;
        });

        if ($cartItems->isEmpty()) {
            return redirect()->route('public.cart.index')
                ->with('error', 'Keranjang belanja kosong');
        }

        foreach ($cartItems as $item) {
            if ($item->jumlah > $item->barang->stok) {
                return redirect()->route('public.cart.index')
                    ->with('error', "Stok {$item->barang->nama_barang} tidak mencukupi");
            }
        }

        $subtotal = $cartItems->sum(function($item) {
            return $item->barang->harga_setelah_diskon * $item->jumlah;
        });

        $totalSavings = $cartItems->sum(function($item) {
            return ($item->barang->harga_jual - $item->barang->harga_setelah_diskon) * $item->jumlah;
        });

        return Inertia::render('public/checkout', [
            'cartItems' => $cartItems->map(function($item) {
                return [
                    'id' => $item->id,
                    'jumlah' => $item->jumlah,
                    'barang' => [
                        'id' => $item->barang->id,
                        'nama_barang' => $item->barang->nama_barang,
                        'kode_barang' => $item->barang->kode_barang,
                        'gambar' => $item->barang->gambar,
                        'harga_jual' => $item->barang->harga_jual,
                        'harga_setelah_diskon' => $item->barang->harga_setelah_diskon,
                        'diskon' => $item->barang->diskon,
                        'stok' => $item->barang->stok,
                    ]
                ];
            }),
            'subtotal' => $subtotal,
            'totalSavings' => $totalSavings,
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'metode_pembayaran' => 'required|in:transfer_bank,e_wallet,cod',
            'alamat_pengiriman' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        DB::beginTransaction();

        try {
            $cartItems = Keranjang::with(['barang' => function($query) {
                $query->where('display', true);
            }])
            ->where('user_id', $user->id)
            ->get()
            ->filter(function($item) {
                return $item->barang !== null;
            });

            if ($cartItems->isEmpty()) {
                throw new \Exception('Keranjang belanja kosong');
            }

            // Check stock availability again
            foreach ($cartItems as $item) {
                if ($item->jumlah > $item->barang->stok) {
                    throw new \Exception("Stok {$item->barang->nama_barang} tidak mencukupi");
                }
            }

            // Calculate totals
            $subtotal = $cartItems->sum(function($item) {
                return $item->barang->harga_setelah_diskon * $item->jumlah;
            });

            $totalSavings = $cartItems->sum(function($item) {
                return ($item->barang->harga_jual - $item->barang->harga_setelah_diskon) * $item->jumlah;
            });

            $transactionItems = $cartItems->map(function($item) {
                return [
                    'barang_id' => $item->barang->id,
                    'nama_barang' => $item->barang->nama_barang,
                    'kode_barang' => $item->barang->kode_barang,
                    'harga_satuan' => $item->barang->harga_jual,
                    'harga_setelah_diskon' => $item->barang->harga_setelah_diskon,
                    'diskon' => $item->barang->diskon,
                    'jumlah' => $item->jumlah,
                    'subtotal' => $item->barang->harga_setelah_diskon * $item->jumlah,
                ];
            })->toArray();

            $transaction = Transaksi::create([
                'user_id' => $user->id,
                'items' => $transactionItems,
                'total_harga' => $subtotal + $totalSavings,
                'diskon_total' => $totalSavings,
                'total_bayar' => $subtotal,
                'status' => Transaksi::STATUS_MENUNGGU_PEMBAYARAN,
                'metode_pembayaran' => $request->metode_pembayaran,
                'alamat_pengiriman' => $request->alamat_pengiriman,
                'batas_pembayaran' => Carbon::now()->addHours(24),
            ]);

            foreach ($cartItems as $item) {
                $item->barang->decrement('stok', $item->jumlah);
            }

            Keranjang::where('user_id', $user->id)->delete();

            DB::commit();

            return redirect()->route('public.transaction.payment', $transaction->id)
                ->with('success', 'Pesanan berhasil dibuat');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', $e->getMessage());
        }
    }

    public function payment($id)
    {
        $transaction = Transaksi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (!$transaction->canBePaid()) {
            return redirect()->route('public.transaction.show', $transaction->id)
                ->with('error', 'Transaksi tidak dapat dibayar');
        }

        return Inertia::render('public/payment', [
            'transaction' => [
                'id' => $transaction->id,
                'kode_transaksi' => $transaction->kode_transaksi,
                'items' => $transaction->items,
                'total_harga' => $transaction->total_harga,
                'diskon_total' => $transaction->diskon_total,
                'total_bayar' => $transaction->total_bayar,
                'status' => $transaction->status,
                'status_label' => $transaction->status_label,
                'metode_pembayaran' => $transaction->metode_pembayaran,
                'alamat_pengiriman' => $transaction->alamat_pengiriman,
                'batas_pembayaran' => $transaction->batas_pembayaran,
                'created_at' => $transaction->created_at,
            ]
        ]);
    }

    public function uploadPaymentProof(Request $request, $id)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        $transaction = Transaksi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (!$transaction->canBePaid()) {
            return back()->with('error', 'Transaksi tidak dapat dibayar');
        }

        try {
            $file = $request->file('bukti_pembayaran');
            $filename = 'payment_proof_' . $transaction->kode_transaksi . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store file in storage/app/public/payment_proofs
            $path = $file->storeAs('payment_proofs', $filename, 'public');

            // Delete old payment proof if exists
            if ($transaction->bukti_pembayaran) {
                Storage::disk('public')->delete($transaction->bukti_pembayaran);
            }

            $transaction->update([
                'bukti_pembayaran' => $path,
                'status' => Transaksi::STATUS_DIBAYAR,
                'dibayar_pada' => Carbon::now(),
            ]);

            return back()->with('success', 'Bukti pembayaran berhasil diupload. Pesanan Anda sedang diverifikasi.');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengupload bukti pembayaran: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $transaction = Transaksi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('public/transactionDetail', [
            'transaction' => [
                'id' => $transaction->id,
                'kode_transaksi' => $transaction->kode_transaksi,
                'items' => $transaction->items,
                'total_harga' => $transaction->total_harga,
                'diskon_total' => $transaction->diskon_total,
                'total_bayar' => $transaction->total_bayar,
                'status' => $transaction->status,
                'status_label' => $transaction->status_label,
                'status_badge_color' => $transaction->status_badge_color,
                'metode_pembayaran' => $transaction->metode_pembayaran,
                'bukti_pembayaran' => $transaction->bukti_pembayaran,
                'alamat_pengiriman' => $transaction->alamat_pengiriman,
                'batas_pembayaran' => $transaction->batas_pembayaran,
                'dibayar_pada' => $transaction->dibayar_pada,
                'diproses_pada' => $transaction->diproses_pada,
                'selesai_pada' => $transaction->selesai_pada,
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at,
                'can_be_paid' => $transaction->canBePaid(),
                'is_expired' => $transaction->isExpired(),
            ]
        ]);
    }

    public function index()
    {
        $transactions = Transaksi::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('public/transactionList', [
            'transactions' => $transactions->through(function($transaction) {
                return [
                    'id' => $transaction->id,
                    'kode_transaksi' => $transaction->kode_transaksi,
                    'total_bayar' => $transaction->total_bayar,
                    'status' => $transaction->status,
                    'status_label' => $transaction->status_label,
                    'status_badge_color' => $transaction->status_badge_color,
                    'metode_pembayaran' => $transaction->metode_pembayaran,
                    'batas_pembayaran' => $transaction->batas_pembayaran,
                    'created_at' => $transaction->created_at,
                    'can_be_paid' => $transaction->canBePaid(),
                    'is_expired' => $transaction->isExpired(),
                    'items_count' => count($transaction->items),
                ];
            })
        ]);
    }

    public function cancel($id)
    {
        $transaction = Transaksi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (!in_array($transaction->status, [Transaksi::STATUS_PENDING, Transaksi::STATUS_MENUNGGU_PEMBAYARAN])) {
            return back()->with('error', 'Transaksi tidak dapat dibatalkan');
        }

        DB::beginTransaction();

        try {
            // Restore stock
            foreach ($transaction->items as $item) {
                Barang::where('id', $item['barang_id'])
                    ->increment('stok', $item['jumlah']);
            }

            $transaction->update([
                'status' => Transaksi::STATUS_DIBATALKAN
            ]);

            DB::commit();

            return back()->with('success', 'Transaksi berhasil dibatalkan');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Gagal membatalkan transaksi: ' . $e->getMessage());
        }
    }
}
