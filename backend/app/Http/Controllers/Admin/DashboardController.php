<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
   public function index()
{
    return response()->json([
        'message' => 'Admin dashboard data placeholder',
        // You will later add real stats here
    ]);
}
}
