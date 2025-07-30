<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jasa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $jasa = Jasa::select([
            'id',
            'nama_jasa',
            'kode_jasa',
            'foto',
            'harga',
            'kategori',
            'display',
            'status_rekomendasi',
            'created_at'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        $kategori = Jasa::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/service/index', [
            'jasa' => $jasa,
            'kategori' => $kategori,
        ]);
    }

    public function create()
    {
        $kategori = Jasa::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/service/create', [
            'kategori' => $kategori,
        ]);
    }

    private function storeImage($file, $oldImagePath = null)
    {
        $folderPath = "assets/gambar/jasa";

        if (!Storage::disk('public')->exists($folderPath)) {
            Storage::disk('public')->makeDirectory($folderPath, 0755, true);
        }

        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
            Storage::disk('public')->delete($oldImagePath);
        }

        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . bin2hex(random_bytes(5)) . '.' . $extension;
        $filePath = $folderPath . '/' . $filename;

        Storage::disk('public')->putFileAs($folderPath, $file, $filename);

        return $filePath;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_jasa' => 'required|string|max:255',
            'kode_jasa' => 'required|string|max:50|unique:tb_jasa,kode_jasa',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'snk' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'kategori' => 'nullable|string|max:100',
            'display' => 'boolean',
            'status_rekomendasi' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($request->nama_jasa);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $this->storeImage($request->file('foto'));
        }

        $validated['display'] = $request->boolean('display', true);
        $validated['status_rekomendasi'] = $request->boolean('status_rekomendasi', false);

        Jasa::create($validated);

        return redirect()->route('admin.services.jasa')
            ->with('success', 'Jasa berhasil ditambahkan');
    }

    public function edit($id)
    {
        $jasa = Jasa::findOrFail($id);
        $kategori = Jasa::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/service/edit', [
            'jasa' => $jasa,
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, $id)
    {
        $jasa = Jasa::findOrFail($id);

        $validated = $request->validate([
            'nama_jasa' => 'required|string|max:255',
            'kode_jasa' => ['required', 'string', 'max:50', Rule::unique('tb_jasa', 'kode_jasa')->ignore($id)],
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'snk' => 'nullable|string',
            'harga' => 'required|numeric|min:0',
            'kategori' => 'nullable|string|max:100',
            'display' => 'boolean',
            'status_rekomendasi' => 'boolean',
            'delete_photo' => 'nullable|boolean',
        ]);

        $validated['slug'] = Str::slug($request->nama_jasa);

        if ($request->boolean('delete_photo')) {
            if ($jasa->foto && Storage::disk('public')->exists($jasa->foto)) {
                Storage::disk('public')->delete($jasa->foto);
            }
            $validated['foto'] = null;
        } elseif ($request->hasFile('foto')) {
            $validated['foto'] = $this->storeImage($request->file('foto'), $jasa->foto);
        } else {
            $validated['foto'] = $jasa->foto;
        }

        $validated['display'] = $request->boolean('display');
        $validated['status_rekomendasi'] = $request->boolean('status_rekomendasi');

        $jasa->update($validated);

        return redirect()->route('admin.services.jasa')
            ->with('success', 'Jasa berhasil diperbarui');
    }

    public function destroy($id)
    {
        $jasa = Jasa::findOrFail($id);

        if ($jasa->foto && Storage::disk('public')->exists($jasa->foto)) {
            Storage::disk('public')->delete($jasa->foto);
        }

        $jasa->delete();

        return redirect()->route('admin.services.jasa');
    }

    public function show($id)
    {
        $jasa = Jasa::findOrFail($id);

        return Inertia::render('admin/service/show', [
            'jasa' => $jasa
        ]);
    }
}
