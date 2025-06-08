#!/bin/bash

# O Grande Final do Docker: Hora de Desligar Tudo!
echo "🎭 Senhoras e senhores, o show acabou! Vamos apagar as luzes e mandar esses contêineres pra cama! 😴"

# Desativando os contêineres com um passe de mágica
echo "🪄 Lançando o feitiço do descanso: docker-compose down..."
docker-compose down

# Verificando se tudo foi desligado direitinho
if [ $? -eq 0 ]; then
  echo "🎉 Beleza pura! Os contêineres foram pro sono profundo, e nada de SQLSTATE[08006] pra nos assombrar! 🥳"
else
  echo "😱 Peraí, os duendes do Docker estão resistindo! Dê uma checada no docker-compose.yml ou veja se o .env tá fazendo birra de novo. 🪦"
  exit 1
fi

# Pausa pra dar aquele clima de final de novela
sleep 2

# Mensagem de despedida com estilo
echo "🌙 Tudo desligado, localhost tá mais quieto que cidade pequena à meia-noite!"
echo "---------------------------------------------------"
echo "💤 Os contêineres foram descansar, e o .env finalmente parou de fugir. Ou será que não? 🕵️‍♂️"
echo "🚀 Até a próxima, você, lenda do código! Vai tomar um café e volta com tudo! ☕"
echo "---------------------------------------------------"