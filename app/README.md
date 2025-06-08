# Empréstimo Finder Brasil

Aplicação web moderna para comparação de ofertas de empréstimo entre diferentes instituições financeiras no Brasil, desenvolvida com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Frontend**:
  - React 18 com TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn/UI + Radix UI
  - Recharts
  - React Query
  - Date-fns

## 📦 Como Executar

1. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

3. Acesse `http://localhost:8081` no navegador

## 🛠️ Estrutura do Projeto

```
src/
├── components/    # Componentes reutilizáveis
│   ├── ui/       # Componentes de UI
│   └── ...
├── hooks/        # Hooks personalizados
├── lib/          # Utilitários
├── pages/        # Páginas
├── services/     # APIs e serviços
└── utils/        # Funções auxiliares
```

## 🌐 Rotas

- **/** - Página inicial com busca de ofertas
- **/not-found** - Página 404

## 💡 Funcionalidades

- Busca de ofertas por CPF e valor
- Comparação de taxas entre bancos
- Visualização em gráficos
- Interface responsiva
- Validação de formulários

## 📝 Licença

MIT
