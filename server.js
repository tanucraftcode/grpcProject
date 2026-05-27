const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto
const packageDef = protoLoader.loadSync(path.join(__dirname, "user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const { user } = grpc.loadPackageDefinition(packageDef);

// In-memory "database"
let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob",   email: "bob@example.com" },
];
let nextId = 3;

// --- Handlers ---

function GetUser(call, callback) {
  const user = users.find((u) => u.id === call.request.id);
  if (!user) {
    return callback({ code: grpc.status.NOT_FOUND, message: "User not found" });
  }
  callback(null, { ...user, message: "User found" });
}

function CreateUser(call, callback) {
  const { name, email } = call.request;
  if (!name || !email) {
    return callback({ code: grpc.status.INVALID_ARGUMENT, message: "name and email are required" });
  }
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  callback(null, { ...newUser, message: "User created successfully" });
}

function ListUsers(call, callback) {
  callback(null, { users });
}

// --- Start server ---

const server = new grpc.Server();
server.addService(user.UserService.service, { GetUser, CreateUser, ListUsers });

const PORT = "50051";
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`gRPC server running on port ${port}`);
});
