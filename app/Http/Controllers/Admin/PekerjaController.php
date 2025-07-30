<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PekerjaController extends Controller
{
    public function index()
    {
        return inertia('maintenance');
    }
}
