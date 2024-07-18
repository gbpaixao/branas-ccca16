import { Signup } from "../usecases/Signup";
import { GetAccount } from "../usecases/GetAccount";
import { AccountDAODatabase } from "../src/resources";

test("Should create passenger account", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const getAccount = new GetAccount(accountDAO)
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger)
});

test("Should create driver account", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: 'QWE1234',
		isDriver: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const getAccount = new GetAccount(accountDAO)
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.car_plate).toBe(input.carPlate)
  expect(outputGetAccount.is_driver).toBe(input.isDriver)
});


test("Should throw an error when creating driver account with an invalid car plate", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: 'QWER234',
		isDriver: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Invalid car plate")
});

test("Should throw an error when creating account with an invalid cpf", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Invalid cpf")
});

test("Should throw an error when creating account with an invalid email", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Invalid email")
});

test("Should throw an error when creating account with an invalid name", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Invalid name")
});

test("Should throw an error when creating account with an email already registered", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const accountDAO = new AccountDAODatabase()
	const signup = new Signup(accountDAO);
  await signup.execute(input)
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Account already exists")
});