import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

describe("E2E Test Suite", () => {
  describe("E2E Tests for Server in a non-test env", () => {
    it("should start with PORT 4000", async () => {
      const PORT = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT;
      jest.spyOn(console, console.log.name);

      const { default: server } = await import("../src/index.js");
      await waitForServerStatus(server);

      const serverInfo = server.address();
      expect(serverInfo.port).toBe(4000);
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}: ${serverInfo.port}`
      );

      return new Promise((resolve) => server.close(resolve));
    });
  });

  describe("E2E Test for Server", () => {
    let _testServer;
    let _testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();

      await waitForServerStatus(_testServer);

      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    afterAll((done) => _testServer.close(done));

    it("should return 404 for unsupported routes", async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`, {
        method: "POST",
      });
      expect(response.status).toBe(404);
    });

    it("should return 500 for invalid body error", async () => {
      jest.spyOn(console, console.error.name);

      const invalidBody = "</h1>invalid body<h1>";

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: invalidBody,
      });
      expect(response.status).toBe(500);
      expect(console.error).toHaveBeenCalledWith(
        "deu ruim",
        new SyntaxError("Unexpected token < in JSON at position 0")
      );
    });

    it("should return 400 and missing cpf message when body is invalid", async () => {
      const invalidPerson = { name: "Fulano da Silva" }; // Missing CPF

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("cpf is required");
    });

    it("should return 400 and missing name message when body is invalid", async () => {
      const invalidPerson = { cpf: "123.456.789-00" }; // Missing NAME

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("name is required");
    });

    it("should return 400 when name does not have last name", async () => {
      const invalidPerson = { name: "Xuxa", cpf: "123.456.789-00" };

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      const expected = JSON.stringify({cpf: '12345678900', name: "Xuxa", lastName: ""})
      expect(data.validationError).toEqual(`Cannot save invalid person: ${expected}`);
    });

    it("should return 200 and save a person on success", async () => {
      jest.spyOn(console, "log");

      const person = { name: "Xuxa da Silva", cpf: "123.456.789-00" };

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(person),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.result).toEqual("ok");
      expect(console.log).toHaveBeenCalledWith("registrado com sucesso!!", {
        cpf: "12345678900",
        lastName: "da Silva",
        name: "Xuxa",
      });
    });
  });
});
