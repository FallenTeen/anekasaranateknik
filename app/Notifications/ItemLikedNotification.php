<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Barang;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ItemLikedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $barang;

    public function __construct(User $user, Barang $barang)
    {
        $this->user = $user;
        $this->barang = $barang;
    }

    public function via($notifiable)
    {
        return ['broadcast', 'database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'item_liked',
            'title' => 'Item Disukai',
            'message' => "{$this->user->name} menyukai {$this->barang->nama_barang}",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'barang_id' => $this->barang->id,
            'barang_name' => $this->barang->nama_barang,
            'barang_image' => $this->barang->gambar,
            'timestamp' => now()->toISOString(),
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'item_liked',
            'title' => 'Item Disukai',
            'message' => "{$this->user->name} menyukai {$this->barang->nama_barang}",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'barang_id' => $this->barang->id,
            'barang_name' => $this->barang->nama_barang,
            'barang_image' => $this->barang->gambar,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function broadcastOn()
    {
        return ['admin-notifications'];
    }

    public function broadcastAs()
    {
        return 'item.liked';
    }
}
