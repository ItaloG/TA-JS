import Service from "./service.js";

const data = {
  username: `italog-${Date.now()}`,
  password: "senhasecreta",
};

const service = new Service({
  filename: "./users.ndjson",
});

await service.create(data);

const users = await service.read();
console.log('Users', users);