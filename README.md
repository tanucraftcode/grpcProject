# gRPC Demo — Node.js

A minimal gRPC project with a **UserService** demonstrating unary RPCs.

## Structure

```
grpc-demo/
├── user.proto   # Service & message definitions
├── server.js    # gRPC server (port 50051)
├── client.js    # Client that calls all RPCs
└── package.json
```

## RPCs

| Method       | Request          | Response           |
|-------------|------------------|--------------------|
| GetUser     | `{ id }`         | Single user        |
| CreateUser  | `{ name, email }`| Created user       |
| ListUsers   | `{}`             | Array of all users |

## Run

```bash
npm install

# Terminal 1 — start server
node server.js

# Terminal 2 — run client
node client.js
```
