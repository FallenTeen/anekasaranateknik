<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Buyer 1',
                'email' => 'buyer@example.com',
                'password' => bcrypt('123'),
                'role' => 'user',
            ],
            [
                'name' => 'Buyer 2',
                'email' => 'buyer2@example.com',
                'password' => bcrypt('123'),
                'role' => 'user',
            ],
        ]);
    }
}
