<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $notifikasi = Notifikasi::orderBy('created_at', 'desc')
            ->paginate(20);

        $statistik = [
            'total' => Notifikasi::count(),
            'belum_dibaca' => Notifikasi::unread()->count(),
            'user_registered' => Notifikasi::byType(Notifikasi::TYPE_USER_REGISTERED)->count(),
            'item_liked' => Notifikasi::byType(Notifikasi::TYPE_ITEM_LIKED)->count(),
            'item_keranjang' => Notifikasi::byType(Notifikasi::TYPE_ITEM_MASUK_KERANJANG)->count(),
            'payment_selesai' => Notifikasi::byType(Notifikasi::TYPE_PAYMENT_SELESAI)->count(),
        ];

        return Inertia::render('admin/notifikasi/index', [
            'notifikasi' => $notifikasi,
            'statistik' => $statistik,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:100',
            'judul' => 'required|string|max:255',
            'pesan' => 'required|string',
            'data' => 'nullable|array',
        ]);

        Notifikasi::create($validated);

        return redirect()->back()->with('success', 'Notifikasi berhasil ditambahkan');
    }

    public function markAsRead($id)
    {
        $notifikasi = Notifikasi::findOrFail($id);
        $notifikasi->markAsRead();

        return redirect()->back()->with('success', 'Notifikasi ditandai sudah dibaca');
    }

    public function destroy($id)
    {
        $notifikasi = Notifikasi::findOrFail($id);
        $notifikasi->delete();

        return redirect()->back()->with('success', 'Notifikasi berhasil dihapus');
    }

    public function broadcast(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'required|string',
        ]);

        Notifikasi::create([
            'type' => 'broadcast',
            'judul' => $validated['judul'],
            'pesan' => $validated['pesan'],
            'data' => [
                'broadcast' => true,
                'sent_at' => now(),
            ],
        ]);

        return redirect()->back()->with('success', 'Notifikasi broadcast berhasil dikirim');
    }
}
