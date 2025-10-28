# API REST - Autenticação Segura de Usuários

Uma API REST em Node.js com cadastro e autenticação de usuários usando hash de senhas e **JWT** para autenticação.

## 🔒 Recursos de Segurança

- ✅ **JWT**: Tokens para autenticação _stateless_
- ✅ **Validação de Email**: Formato validado
- ✅ **Validação de Senha**: Requisitos de força (8+ caracteres, maiúscula, minúscula, número)
- ✅ **CORS**: Configurável por variáveis de ambiente
- ✅ **Proteção de Rotas**: Middleware de autenticação
- ✅ **Tratamento de Erros**: Responses padronizadas

## 🚀 Como Começar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

- `JWT_SECRET`: Uma chave secreta forte (mude em produção!)
- `PORT`: Porta do servidor (padrão: 3000)
- Outras configurações conforme necessário

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Ou em produção:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

#### Registrar Novo Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "name": "João Silva",
  "password": "SenhaForte123"
}
```

**Resposta de Sucesso (201):**

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "SenhaForte123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Usuários (Requer Autenticação)

#### Obter Perfil do Usuário

```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "created_at": "2025-10-28T10:30:00Z",
    "updated_at": "2025-10-28T10:30:00Z",
    "last_login": "2025-10-28T10:35:00Z"
  }
}
```

### Health Check

```http
GET /health
```

## 🔐 Como Funciona a Segurança

### 1. Hash de Senhas

...

### 2. Autenticação com JWT

1. Usuário faz login com email e senha
2. Senha é comparada com o hash armazenado
3. Se válida, um **token JWT** é gerado:

   - Contém `userId` e `email` do usuário
   - Assinado com a chave secreta (`JWT_SECRET`)
   - Expira em 24 horas (configurável)

4. Cliente envia o token em futuras requisições:

   ```
   Authorization: Bearer <token>
   ```

5. Servidor valida o token antes de processar a requisição

### 3. Validação de Senhas

A API garante que senhas sejam fortes:

- ✓ Mínimo 8 caracteres
- ✓ Pelo menos 1 letra maiúscula
- ✓ Pelo menos 1 letra minúscula
- ✓ Pelo menos 1 número

## 📁 Estrutura do Projeto

```
demo-hash/
├── src/
│   ├── server.js          # Entrada da aplicação
│   ├── config.js          # Configurações (variáveis de ambiente)
│   ├── database.js        # Gerenciador de banco de dados (SQLite)
│   ├── auth.js            # Funções de autenticação
│   ├── middleware.js      # Middlewares (autenticação, tratamento de erros)
│   └── routes/
│       ├── auth.js        # Rotas de registro e login
│       └── users.js       # Rotas de usuário (protegidas)
├── package.json           # Dependências
├── .env.example           # Exemplo de variáveis de ambiente
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Express.js**: Framework web
- **jsonwebtoken**: Geração e verificação de JWT
- **better-sqlite3**: Banco de dados SQLite
- **dotenv**: Gerenciamento de variáveis de ambiente
- **CORS**: Controle de acesso entre origens
- **nodemon**: Reload automático em desenvolvimento

## ⚠️ Boas Práticas de Segurança Implementadas

1. **Nunca armazene senhas em texto plano** ✓
2. **Valide emails e senhas** ✓
3. **Use JWT com data de validade** ✓
4. **Proteja rotas sensíveis com middleware** ✓
5. **Implemente CORS** ✓
6. **Trate erros adequadamente** ✓
7. **Use variáveis de ambiente para secrets** ✓

## 🧪 Testando a API

### Com cURL

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "name": "Teste User",
    "password": "SenhaForte123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "SenhaForte123"
  }'

# Acessar perfil (substitua TOKEN pelo token retornado)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Com Postman ou Insomnia

Importe as requisições listadas na seção de endpoints ou crie uma coleção manualmente.

## 📝 Próximos Passos (Opcional)

- Adicionar refresh tokens
- Implementar 2FA (autenticação de dois fatores)
- Adicionar testes automatizados (Jest)
- Adicionar validação com biblioteca como Joi
- Implementar rate limiting
- Adicionar logs estruturados
- Criar documentação com Swagger/OpenAPI

## 👨‍💻 Autor
