<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Barang;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ItemAddedToCartNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $barang;
    protected $quantity;

    public function __construct(User $user, Barang $barang, $quantity = 1)
    {
        $this->user = $user;
        $this->barang = $barang;
        $this->quantity = $quantity;
    }

    public function via($notifiable)
    {
        return ['broadcast', 'database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'item_added_to_cart',
            'title' => 'Item Masuk Keranjang',
            'message' => "{$this->user->name} menambahkan {$this->quantity} {$this->barang->nama_barang} ke keranjang",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'barang_id' => $this->barang->id,
            'barang_name' => $this->barang->nama_barang,
            'barang_image' => $this->barang->gambar,
            'quantity' => $this->quantity,
            'price' => $this->barang->harga_setelah_diskon,
            'total_price' => $this->barang->harga_setelah_diskon * $this->quantity,
            'timestamp' => now()->toISOString(),
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'item_added_to_cart',
            'title' => 'Item Masuk Keranjang',
            'message' => "{$this->user->name} menambahkan {$this->quantity} {$this->barang->nama_barang} ke keranjang",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'barang_id' => $this->barang->id,
            'barang_name' => $this->barang->nama_barang,
            'barang_image' => $this->barang->gambar,
            'quantity' => $this->quantity,
            'price' => $this->barang->harga_setelah_diskon,
            'total_price' => $this->barang->harga_setelah_diskon * $this->quantity,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function broadcastOn()
    {
        return ['admin-notifications'];
    }

    public function broadcastAs()
    {
        return 'item.added.to.cart';
    }
}
