<?php

use App\Http\Controllers\Api\BumdesApiController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Endpoint API resmi untuk BUMDes Desa Wengkal.
|
*/

Route::get('/bootstrap', [BumdesApiController::class, 'bootstrap']);

Route::match(['get', 'post'], '/income', [BumdesApiController::class, 'income']);
Route::match(['get', 'post'], '/expenses', [BumdesApiController::class, 'expenses']);
Route::match(['get', 'post'], '/items', [BumdesApiController::class, 'items']);
Route::match(['get', 'post'], '/loans', [BumdesApiController::class, 'loans']);
Route::post('/loans/{id}/return', [BumdesApiController::class, 'returnLoan']);
Route::get('/savings-loans', [BumdesApiController::class, 'savingsLoans']);
Route::get('/bumdes-types', [BumdesApiController::class, 'bumdesTypes']);
Route::match(['get', 'post'], '/settings', [BumdesApiController::class, 'settings']);

Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
