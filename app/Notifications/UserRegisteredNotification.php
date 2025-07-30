<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class UserRegisteredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['broadcast', 'database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'user_registered',
            'title' => 'User Baru Terdaftar',
            'message' => "User baru {$this->user->name} telah mendaftar di sistem",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_email' => $this->user->email,
            'timestamp' => now()->toISOString(),
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'user_registered',
            'title' => 'User Baru Terdaftar',
            'message' => "User baru {$this->user->name} telah mendaftar di sistem",
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_email' => $this->user->email,
            'timestamp' => now()->toISOString(),
        ]);
    }

    public function broadcastOn()
    {
        return ['admin-notifications'];
    }

    public function broadcastAs()
    {
        return 'user.registered';
    }
}
