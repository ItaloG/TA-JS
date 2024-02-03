import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person.js";

describe("#Person Suite", () => {
  describe("#validate", () => {
    it("should throw if the name is not present", () => {
      // mock é a entrada necessária para que o teste funcione
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("name is required")
      );
    });

    it("should throw if the cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Zezinho",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("cpf is required")
      );
    });

    it("should not throw if person is valid", () => {
      const mockValidPerson = {
        name: "Zezinho",
        cpf: "123.456.789-00",
      };

      expect(() => Person.validate(mockValidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    // parte do princípio que os dados ja foram validados!
    it("should format the person name and CPF", () => {
      // AAA

      // Arrange = Prepara
      const mockPerson = {
        name: "Xuxa da Silva",
        cpf: "000.999.444-11",
      };
      // Act = Executar
      const formattedPerson = Person.format(mockPerson);

      // Assert = Validar
      const expected = {
        name: "Xuxa",
        cpf: "00099944411",
        lastName: "da Silva",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#save", () => {
    it("should throw if name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        lastName: "da Silva",
        cpf: "123.456.789-00",
      };
      expect(() => {
        Person.save(mockInvalidPerson);
      }).toThrow(new Error(`Can't save invalid person: {\"name\":\"\",\"lastName\":\"da Silva\",\"cpf\":\"123.456.789-00\"}`));
    });

    it("should throw if cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Zezinho",
        lastName: "da Silva",
        cpf: "",
      };
      expect(() => {
        Person.save(mockInvalidPerson);
      }).toThrow(new Error(`Can't save invalid person: {\"name\":\"Zezinho\",\"lastName\":\"da Silva\",\"cpf\":\"\"}`));
    });

    it("should throw if lastName is not present", () => {
      const mockInvalidPerson = {
        name: "Zezinho",
        lastName: "",
        cpf: "123.456.789-00",
      };
      expect(() => {
        Person.save(mockInvalidPerson);
      }).toThrow(new Error(`Can't save invalid person: {\"name\":\"Zezinho\",\"lastName\":\"\",\"cpf\":\"123.456.789-00\"}`));
    });

    it('should log saved person on success', () => {
      const mockValidPerson = {
        name: "Zezinho",
        lastName: "da Silva",
        cpf: "123.456.789-00",
      };
      
      const logSpy = jest.spyOn(console, console.log.name)

      Person.save(mockValidPerson);

      const expected = ['registrado com sucesso!!', {"cpf": "123.456.789-00", "lastName": "da Silva", "name": "Zezinho"}]

      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(...expected)
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      // Uma outra ideia é não retestar o que já foi testado

      // lembra dos checkpoints?
      // Testou do caminho a ao caminho B,
      //  agora testa do caminho B ao caminho C
      // Então aqui, eu pulo o caminho A (validate), caminho B (format)
      // e vou direto para o caminho C (save), pois, estes caminho
      // ja foram validados

      // Este método abaixo faz mais sentido para quando se tem intereções externas como
      // chmadas de API, bancos de dados, etc (que será mostrado na próxima aula)

      // Mocks são simulações de funções que você pode fazer ao testar o comportamento!!

      /// AAA = Arrange, Act, Assert

      // Arrange
      const mockPerson = {
        name: "Zezin da Silva",
        cpf: "123.456.789-00",
      };
      jest.spyOn(Person, Person.validate.name).mockReturnValue();
      // .mockImplementation(() => {
      //   throw new Error("Deu ruim!!");
      // });

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        cpf: "12346578900",
        name: "Zezin",
        lastName: "da Silva",
      });

      // Act
      const result = Person.process(mockPerson);

      // Assert
      const expected = "ok";
      expect(result).toStrictEqual(expected);
    });
  });
});
