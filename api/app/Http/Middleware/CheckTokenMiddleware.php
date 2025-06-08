<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Obtém o cabeçalho Authorization
        $authHeader = $request->header('Authorization');

        // Verifica se o cabeçalho existe e contém "Bearer"
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return response()->json([
                'message' => 'Token não fornecido ou inválido'
            ], 401);
        }

        // Extrai o token
        $token = $matches[1];

        // Exemplo de validação do token (substitua pela sua lógica)
        // Aqui, verificamos se o token é igual a um valor esperado (exemplo simples)
        $validToken = env('API_TOKEN', 'seu-token-secreto-aqui'); // Defina no .env

        if ($token !== $validToken) {
            return response()->json([
                'message' => 'Token inválido'
            ], 401);
        }

        // Se o token for válido, prossegue com a requisição
        return $next($request);
    }
}
