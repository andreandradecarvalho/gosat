<?php
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\BankController;
use App\Http\Controllers\OfferController;
/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/


$router->get('healthcheck', function () use ($router) {
    return response()->json([
        'status' => 'success',
        'message' => 'Sistema online',
        'timestamp' => date('Y-m-d H:i:s')
    ], Response::HTTP_OK);
});

$router->group(['middleware' => 'auth.token', 'prefix' => 'api'], function () use ($router) {
    $router->group(['prefix' => 'v1'], function () use ($router) {
        $router->post('/consulta-ofertas-de-credito', 'BankController@getAvailableBanks');
        $router->post('/simulacao-de-oferta-de-credito', 'OfferController@getOffer');
    });
});


$router->get('{any:.*}', function () {
    return response()->json(['message' => 'Rota não encontrada.'], 404);
});
