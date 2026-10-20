<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    private const STATUSES = ['pending_review', 'processing', 'shipped', 'completed', 'cancelled'];

    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->withCount('items')->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder->where('order_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return response()->json([
            'data' => $query->paginate(min(max((int) $request->query('per_page', 50), 1), 100)),
            'statuses' => self::STATUSES,
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(['data' => $order->load('items')]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(self::STATUSES)],
        ]);

        $order->status = $validated['status'];
        $order->save();

        return response()->json(['data' => $order->fresh()->load('items')]);
    }
}
