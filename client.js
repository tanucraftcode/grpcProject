const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");// protoLoader (@grpc/proto-loader) is a library that reads and parses .protoLoader (@grpc/proto-loader) is a library that reads and parses .proto files at runtime in Node.js — so you don't need to pre-compile them into code.
const path = require("path");

const packageDef = protoLoader.loadSync(path.join(__dirname, "user.proto"), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const { user } = grpc.loadPackageDefinition(packageDef);

const client = new user.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Helper: promisify gRPC call
const call = (method, req) =>
  new Promise((res, rej) =>
    client[method](req, (err, resp) => (err ? rej(err) : res(resp)))
  );

async function main() {
  console.log("\n=== List all users ===");
  const list = await call("ListUsers", {});
  console.log(list.users);

  console.log("\n=== Get user by ID (id: 1) ===");
  const found = await call("GetUser", { id: 1 });
  console.log(found);

  console.log("\n=== Create a new user ===");
  const created = await call("CreateUser", { name: "Charlie", email: "charlie@example.com" });
  console.log(created);

  console.log("\n=== List users after creation ===");
  const updated = await call("ListUsers", {});
  console.log(updated.users);

  console.log("\n=== Get non-existent user (id: 99) ===");
  try {
    await call("GetUser", { id: 99 });
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

main().catch(console.error);
