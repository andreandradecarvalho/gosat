# Sistema de Simulação de Crédito

Este é um sistema web moderno para simulação e consulta de ofertas de crédito, desenvolvido com tecnologias de ponta para fornecer uma experiência de usuário fluida e responsiva.


## 📹 Demonstrações em Vídeo

### Apresentação
Veja uma apresentação do aplicativo:
- 🎥 [Assista ao vídeo de demonstração](https://www.loom.com/share/bf28ec44eccf4e6e934877a1b75c7208?sid=1ab2db80-0837-4e31-8636-f61c55338862)

### Gosat API e Configurações 🚀
Explore a configuração técnica e a API:
- 🎥 [Assista ao vídeo de configuração](https://www.loom.com/share/f8b5883e93b24ea7beb9488f8330b565?sid=cc64aabe-11e9-47bf-b82a-a57a1cf85269)

### Demonstração Detalhada do APP
Para uma visão mais aprofundada das funcionalidades:
- 🎥 [Assista ao vídeo detalhado](https://www.loom.com/share/cae77e3d46434e568685e002289a58ea?sid=d7fcc32d-585d-4845-90a7-d3be02704282)



## 🚀 Tecnologias Utilizadas

### Backend (Laravel + Vite + Tailwind)

- **PHP 8.2+** — Linguagem principal do backend.
- **Lumen 10** — Framework MVC para construção de APIs e aplicações web robustas.
- **Vite** — Bundler moderno para assets frontend, integrado ao Laravel via `laravel-vite-plugin`.
- **TailwindCSS** — Framework utilitário para estilização CSS.
- **Axios** — Cliente HTTP para requisições assíncronas no frontend.
- **Composer** — Gerenciador de dependências PHP.
- **NPM** — Gerenciador de pacotes JS para assets e ferramentas frontend.
- **Docker** — Containerização para ambientes de desenvolvimento e produção.

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional

### Frontend (React + TypeScript + Vite + Tailwind + Shadcn)

- **React 18** - Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Vite** - Build tool e servidor de desenvolvimento ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **Shadcn/UI** - Componentes de UI acessíveis e personalizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquema Type-first
- **TanStack Query** - Gerenciamento de estado e cache de dados
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Ícones modernos e elegantes

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para identificar e reportar padrões no código
- **Prettier** - Formatador de código
- **Husky** - Git hooks
- **Commitlint** - Validação de mensagens de commit

## 📦 Estrutura do Projeto

### 🚀 Frontend (App)

```
app/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/           # Componentes de UI (Shadcn)
│   │   └── ...
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Utilitários e configurações
│   └── utils/           # Funções utilitárias
├── public/             # Arquivos estáticos
├── package.json        # Dependências e scripts
└── vite.config.ts      # Configuração do Vite
```

### 🔧 Backend (API)

```
api/
├── app/
│   ├── Http/           # Lógica da aplicação
│   │   ├── Controllers/ # Controladores da API
│   │   └── Middleware/  # Middlewares
│   ├── Models/         # Modelos de dados
│   └── Providers/      # Service Providers
├── routes/             # Definição de rotas da API
├── database/           # Migrações e seeds
├── config/            # Arquivos de configuração
├── tests/             # Testes automatizados
└── composer.json      # Dependências PHP
```

## 🛠️ Configuração do Ambiente

1. **Pré-requisitos**
   - Node.js (versão 18 ou superior)
   - npm ou yarn
   - Git

2. **Instalação**
   ```bash
   # Clonar o repositório
   git clone [URL_DO_REPOSITORIO]
   cd gosat

   # Instalar dependências
   npm install
   # ou
   yarn
   ```

3. **Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_API_TOKEN=seu_token_aqui
   ```

4. **Executando o Projeto**
   ```bash
   # Modo de desenvolvimento
   npm run dev
   # ou
   yarn dev
   ```

   O aplicativo estará disponível em `http://localhost:80`

### Rotas Gerais

- **GET `/healthcheck`**
  - Retorna um JSON simples para verificação de saúde da API.

### Rotas de API

#### Consultas (`/api/v1/consulta-ofertas-de-credito`)

- **POST `/api/v1/consulta-ofertas-de-credito`**  
  - Consulta de ofertas baseada no CPF do usuário
  - Filtragem por valor desejado
  - Exibição de taxas de juros e condições

#### Simulação (`/api/v1/simulacao-de-oferta-de-credito`)

- **POST `/api/v1/simulacao-oferta-de-credito`**  
  - Simulação de oferta de crédito
  - Exibição de taxas de juros e condições



## 🚀 Funcionalidades

### 1. Consulta de Ofertas de Crédito
- Consulta de ofertas baseada no CPF do usuário
- Filtragem por valor desejado
- Exibição de taxas de juros e condições

#### Exemplo de Requisição:
```typescript
const response = await consultaOfertasDeCredito({
  cpf: '123.456.789-09',
  valor: 10000 // opcional
});
```

#### Resposta da API:
```json
{
  "success": true,
  "message": "Ofertas encontradas com sucesso",
  "data": {
    "instituicoes": [
      {
        "id": 1,
        "nome": "Banco Exemplo",
        "modalidades": [
          {
            "id": 1,
            "nome": "Crédito Pessoal",
            "cod": "CP",
            "simulation": true,
            "offer": {
              "QntParcelaMin": 12,
              "QntParcelaMax": 36,
              "valorMin": 1000,
              "valorMax": 50000,
              "jurosMes": 1.99
            }
          }
        ]
      }
    ]
  }
}
```

### 2. Interface de Usuário
- Formulário de consulta com validação de CPF
- Listagem de ofertas de crédito
- Gráficos comparativos de taxas e condições
- Modal de simulação detalhada

## 🛡️ Segurança
- Validação de CPF no cliente
- Token de autenticação para requisições à API
- Tratamento de erros e feedback ao usuário

## 📊 Estrutura de Dados

### Oferta de Crédito
```typescript
interface OfertaCredito {
  id?: number;
  instituicao: string;
  valorMin: number;
  valorMax: number;
  jurosMes: number;
  qntParcelaMin: number;
  qntParcelaMax: number;
  modalidade?: string;
  codModalidade?: string;
}
```

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Adiciona alguma feature incrível'`)
5. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por André Carvalho
