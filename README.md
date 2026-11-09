# Sistema de Reserva de Quartos para Hotel/Pousada

Aplicação web monolítica no padrão **MVC** para gerenciar a operação de um hotel ou pousada: quartos, clientes, funcionários e reservas, com um dashboard de faturamento.

Feita com **Node.js + Express**, views renderizadas no servidor com **EJS** e banco **PostgreSQL**.

## Funcionalidades

- **Dashboard**: total de funcionários e clientes, faturamento do mês e do ano, faturamento por mês e distribuição de reservas por tipo de quarto (gráficos).
- **Quartos**: cadastro, edição, exclusão e detalhes. Tipos `SINGLE`, `DOUBLE` e `FAMILY`, com diária, número de camas, andar, número e código do quarto.
- **Clientes**: CRUD completo (nome, CPF, telefone, e-mail) e busca por CPF.
- **Funcionários**: CRUD completo, com perfis `admin` e `default` e senha com hash (bcrypt).
- **Reservas**:
  - criação com verificação de disponibilidade do quarto no período escolhido;
  - check-in não pode ser no passado e o check-out precisa ser depois do check-in;
  - valor total calculado automaticamente (diária × número de noites);
  - status `CONFIRMED` → `FINALIZED` ou `CANCELLED`.
- **Admin automático**: na primeira execução, um usuário administrador é criado a partir das variáveis de ambiente.
- Validação de formulários com `express-validator`, mensagens flash e logs em arquivo com `winston`.

## Tecnologias

| Camada | Ferramentas |
| --- | --- |
| Back-end | Node.js, Express, express-session, connect-flash, express-validator |
| Views | EJS, template SB Admin 2 (Bootstrap), Chart.js |
| Banco de dados | PostgreSQL (`pg`), migrations com `node-pg-migrate` |
| Outros | bcrypt, date-fns, uuid, winston, dotenv |

## Arquitetura

```
src/
├── server.js        # configuração do Express, sessão, rotas e tratamento de erros
├── routes/          # definição das rotas por recurso
├── controller/      # regras de negócio (Auth, Customer, Employee, Room, Reserve, Dashboard)
├── model/           # acesso ao banco com SQL puro (pg)
├── validator/       # validações com express-validator
├── views/           # templates EJS (+ partials)
├── public/          # arquivos estáticos (CSS, JS, imagens)
├── db/              # conexão com o banco e criação do admin
└── util/            # logger, validação de env e de datas
migrations/          # migrations do banco (node-pg-migrate)
docs/                # requisitos e modelo conceitual
```

## Modelo de dados

![Modelo conceitual](docs/imagem_modelo_conceitual.png)

- **employee**: `id`, `type` (admin/default), `name`, `password`, `cpf`, `salary`, `created_at`
- **customer**: `id`, `name`, `phone`, `cpf`, `email`, `created_at`
- **room**: `id`, `daily_rate`, `beds`, `type`, `status`, `floor`, `room_number`, `room_code`
- **reserve**: `id`, `total_price`, `check_in`, `check_out`, `employee_id`, `customer_id`, `room_id`, `status`, `created_at`

## Rotas principais

| Recurso | Rotas |
| --- | --- |
| Dashboard | `GET /` |
| Autenticação | `GET /auth/login`, `POST /auth/login` |
| Quartos | `GET /room`, `GET/POST /room/create`, `GET/POST /room/edit/:id`, `GET /room/details/:id`, `POST /room/delete/:id`, `GET /room/json/available` |
| Clientes | `GET /customer`, `GET/POST /customer/create`, `GET/POST /customer/edit/:id`, `GET /customer/details/:id`, `POST /customer/delete/:id`, `GET /customer/json/:cpf` |
| Funcionários | `GET /employee`, `GET/POST /employee/create`, `GET/POST /employee/edit/:id`, `GET /employee/details/:id`, `POST /employee/delete/:id` |
| Reservas | `GET /reserve`, `GET/POST /reserve/create`, `GET /reserve/details/:id`, `POST /reserve/finalize/:id`, `POST /reserve/cancel/:id` |

## Como rodar

### Pré-requisitos

- Node.js 18+
- PostgreSQL

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/VzinCoder/mvc-reservation-system.git
cd mvc-reservation-system

# 2. Instalar as dependências
npm install

# 3. Criar o arquivo de ambiente
cp .env.sample .env
# edite o .env com os dados do seu banco

# 4. Rodar as migrations
npm run migrate up

# 5. Iniciar a aplicação
npm run start:dev   # com nodemon
# ou
npm start
```

A aplicação sobe em `http://localhost:3000`.

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL (ex.: `postgres://usuario:senha@localhost:5432/reservation_system`) |
| `COOKIE_KEY` | Segredo usado para assinar a sessão |
| `NODE_ENV` | `development` ou `production` |
| `ADMIN_NAME` | Nome do administrador criado na primeira execução |
| `ADMIN_PASSWORD` | Senha do administrador |
| `ADMIN_CPF` | CPF do administrador (usado no login) |

## Documentação

- [Requisitos do sistema](docs/requisitos.md)
- [Modelo conceitual](docs/imagem_modelo_conceitual.png)

## Autor

Feito por **Vinicius Pereira** — [GitHub](https://github.com/VzinCoder) · [LinkedIn](https://www.linkedin.com/in/vzincoder)
