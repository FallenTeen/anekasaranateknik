<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Barang::select([
            'id',
            'nama_barang',
            'kode_barang',
            'gambar',
            'stok',
            'harga_jual',
            'diskon',
            'kategori',
            'display',
            'status_rekomendasi',
            'created_at'
        ])
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->harga_setelah_diskon = $item->harga_jual - ($item->harga_jual * $item->diskon / 100);
                $item->average_rating = $item->feedbacks->avg('rating') ?? 0;
                unset($item->feedbacks);
                return $item;
            });

        $kategori = Barang::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/produk/index', [
            'produk' => $produk,
            'kategori' => $kategori,
        ]);
    }

    public function create()
    {
        $kategori = Barang::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/produk/create', [
            'kategori' => $kategori,
        ]);
    }

    private function storeImageByCategory($file, $kategori, $oldImagePath = null)
    {
        $categoryFolder = $kategori ? str_replace([' ', '/'], ['_', '_'], strtolower(trim($kategori))) : 'uncategorized';
        $folderPath = "assets/gambar/produk/{$categoryFolder}";

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

    private function moveImageIfCategoryChanged($currentImagePath, $oldCategory, $newCategory)
    {
        if (!$currentImagePath || $oldCategory === $newCategory) {
            return $currentImagePath;
        }

        $oldCategoryFolder = $oldCategory ? str_replace([' ', '/'], ['_', '_'], strtolower(trim($oldCategory))) : 'uncategorized';
        $newCategoryFolder = $newCategory ? str_replace([' ', '/'], ['_', '_'], strtolower(trim($newCategory))) : 'uncategorized';

        if ($oldCategoryFolder === $newCategoryFolder) {
            return $currentImagePath;
        }

        $newFolderPath = "assets/gambar/produk/{$newCategoryFolder}";
        if (!Storage::disk('public')->exists($newFolderPath)) {
            Storage::disk('public')->makeDirectory($newFolderPath, 0755, true);
        }

        $filename = basename($currentImagePath);
        $newImagePath = $newFolderPath . '/' . $filename;

        if (Storage::disk('public')->exists($currentImagePath)) {
            Storage::disk('public')->move($currentImagePath, $newImagePath);
        }

        return $newImagePath;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => 'required|string|max:50|unique:tb_barang,kode_barang',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gambar_deskripsi.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stok' => 'required|numeric|min:0',
            'harga_beli' => 'required|numeric|min:0',
            'harga_jual' => 'required|numeric|min:0',
            'diskon' => 'nullable|numeric|min:0|max:100',
            'kategori' => 'nullable|string|max:100',
            'display' => 'boolean',
            'status_rekomendasi' => 'boolean',
        ]);

        $validated['kategori'] = $request->input('kategori') ? trim($request->input('kategori')) : null;

        $gambarDeskripsi = [];
        if ($request->hasFile('gambar_deskripsi')) {
            foreach ($request->file('gambar_deskripsi') as $file) {
                $path = $this->storeImageByCategory($file, $validated['kategori']);
                $gambarDeskripsi[] = [
                    'url' => $path,
                    'caption' => $file->getClientOriginalName()
                ];
            }
        }

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $this->storeImageByCategory(
                $request->file('gambar'),
                $validated['kategori']
            );
        }

        $validated['gambar_deskripsi'] = $gambarDeskripsi;
        $validated['diskon'] = $validated['diskon'] ?? 0;
        $validated['display'] = $request->boolean('display', true);
        $validated['status_rekomendasi'] = $request->boolean('status_rekomendasi', false);

        $barang = Barang::create($validated);

        return redirect()->route('admin.produk.kelola')
            ->with('success', 'Produk berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $produk = Barang::findOrFail($id);
        $oldCategory = $produk->kategori;

        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => ['required', 'string', 'max:50', Rule::unique('tb_barang', 'kode_barang')->ignore($id)],
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gambar_deskripsi.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'delete_main_image' => 'nullable|boolean',
            'stok' => 'required|numeric|min:0',
            'harga_beli' => 'required|numeric|min:0',
            'harga_jual' => 'required|numeric|min:0',
            'diskon' => 'nullable|numeric|min:0|max:100',
            'kategori' => 'nullable|string|max:100',
            'display' => 'boolean',
            'status_rekomendasi' => 'boolean',
        ]);

        $validated['kategori'] = $request->input('kategori') ? trim($request->input('kategori')) : null;

        $existingImages = $request->input('existing_images', []);
        $gambarDeskripsi = [];

        if ($produk->gambar_deskripsi) {
            foreach ($produk->gambar_deskripsi as $existingImg) {
                if (in_array($existingImg['url'], $existingImages)) {
                    $gambarDeskripsi[] = $existingImg;
                } else {
                    if (Storage::disk('public')->exists($existingImg['url'])) {
                        Storage::disk('public')->delete($existingImg['url']);
                    }
                }
            }
        }

        if ($request->hasFile('gambar_deskripsi')) {
            foreach ($request->file('gambar_deskripsi') as $file) {
                $path = $this->storeImageByCategory($file, $validated['kategori']);
                $gambarDeskripsi[] = [
                    'url' => $path,
                    'caption' => $file->getClientOriginalName()
                ];
            }
        }

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $this->storeImageByCategory(
                $request->file('gambar'),
                $validated['kategori'],
                $produk->gambar
            );
        } elseif ($request->boolean('delete_main_image')) {
            if ($produk->gambar && Storage::disk('public')->exists($produk->gambar)) {
                Storage::disk('public')->delete($produk->gambar);
            }
            $validated['gambar'] = null;
        } else {
            if ($produk->gambar && $oldCategory !== $validated['kategori']) {
                $validated['gambar'] = $this->moveImageIfCategoryChanged(
                    $produk->gambar,
                    $oldCategory,
                    $validated['kategori']
                );
            }
        }

        $validated['gambar_deskripsi'] = $gambarDeskripsi;
        $validated['diskon'] = $validated['diskon'] ?? 0;
        $validated['display'] = $request->boolean('display');
        $validated['status_rekomendasi'] = $request->boolean('status_rekomendasi');

        unset($validated['existing_images']);

        $produk->update($validated);

        return redirect()->route('admin.produk.kelola')
            ->with('success', 'Produk berhasil diperbarui');
    }

    public function edit($id)
    {
        $produk = Barang::findOrFail($id);
        $kategori = Barang::distinct()->pluck('kategori')->filter()->sort()->values();

        return Inertia::render('admin/produk/edit', [
            'produk' => $produk,
            'kategori' => $kategori,
        ]);
    }

    public function show($id)
    {
        $produk = Barang::select([
            'id',
            'nama_barang',
            'kode_barang',
            'deskripsi',
            'gambar',
            'gambar_deskripsi',
            'stok',
            'harga_beli',
            'harga_jual',
            'diskon',
            'kategori',
            'display',
            'status_rekomendasi',
            'created_at',
            'updated_at'
        ])
            ->withCount(['userLikes as total_likes', 'feedbacks'])
            ->with([
                'feedbacks' => function ($query) {
                    $query->select('barang_id', 'rating');
                }
            ])
            ->findOrFail($id);

        $produk->harga_setelah_diskon = $produk->harga_jual - ($produk->harga_jual * $produk->diskon / 100);
        $produk->average_rating = $produk->feedbacks->avg('rating') ?? 0;
        unset($produk->feedbacks);

        return Inertia::render('admin/produk/show', [
            'produk' => $produk,
        ]);
    }

    public function destroy($id)
    {
        $produk = Barang::findOrFail($id);

        if ($produk->gambar && Storage::disk('public')->exists($produk->gambar)) {
            Storage::disk('public')->delete($produk->gambar);
        }

        if ($produk->gambar_deskripsi) {
            foreach ($produk->gambar_deskripsi as $img) {
                if (Storage::disk('public')->exists($img['url'])) {
                    Storage::disk('public')->delete($img['url']);
                }
            }
        }

        if ($produk->gambar) {
            $folderPath = dirname($produk->gambar);
            $files = Storage::disk('public')->files($folderPath);
            if (empty($files)) {
                Storage::disk('public')->deleteDirectory($folderPath);
            }
        }

        $produk->delete();

        return redirect()->route('admin.produk.kelola');
    }
}
