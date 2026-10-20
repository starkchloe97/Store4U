<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
// use App\Http\Controllers\Admin\ProductController; // to be created
// use App\Http\Controllers\Admin\OrderController;   // to be created

Route::prefix('v1')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Planned routes from README (uncomment as you build controllers)
        // Route::apiResource('products', ProductController::class);
        // Route::get('orders', [OrderController::class, 'index']);
        // Route::get('orders/{order}', [OrderController::class, 'show']);
        // Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    });
});
