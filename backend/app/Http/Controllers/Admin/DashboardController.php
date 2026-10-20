<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::query();

        return response()->json([
            'metrics' => [
                'gross_sales' => (float) (clone $orders)->whereNotIn('status', ['cancelled'])->sum('total'),
                'orders' => (clone $orders)->count(),
                'pending_orders' => (clone $orders)->where('status', 'pending_review')->count(),
                'products' => Product::query()->count(),
                'low_stock' => Product::query()->where('stock', '<=', 5)->count(),
            ],
            'recent_orders' => (clone $orders)->orderByDesc('created_at')->limit(8)->get([
                'id', 'order_number', 'first_name', 'last_name', 'email',
                'total', 'status', 'payment_status', 'created_at',
            ]),
        ]);
    }
}
