
import { GetAccount } from "../src/application/GetAccount";
import { Signup } from "../src/application/Signup";
import { AccountDAODatabase, AccountDAOMemory } from "../src/resources/AccountDAO";
import { MailerGatewayMemory } from "../src/resources/MailerGateway";

let signup: Signup
let getAccount: GetAccount

beforeEach(async () => {
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO)
})

test("Should create passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger)
});

test("Should create driver account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: 'QWE1234',
    isDriver: true
  };
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.carPlate).toBe(input.carPlate)
  expect(outputGetAccount.isDriver).toBe(input.isDriver)
});


test("Should throw an error when creating driver account with an invalid car plate", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: 'QWER234',
    isDriver: true
  };
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
  await signup.execute(input)
  const output = signup.execute(input)
  await expect(output).rejects.toThrow("Account already exists")
});

test("Should create passenger account com stub", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const createAccountStub = jest.spyOn(AccountDAODatabase.prototype, 'createAccount').mockResolvedValue(input)
  const findAccountByEmailStub = jest.spyOn(AccountDAODatabase.prototype, 'findAccountByEmail').mockResolvedValue(null)
  const findAccountByIdStub = jest.spyOn(AccountDAODatabase.prototype, 'findAccountById').mockResolvedValue(input)
  const accountDAO = new AccountDAODatabase()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  createAccountStub.mockRestore()
  findAccountByEmailStub.mockRestore()
  findAccountByIdStub.mockRestore()
});

test("Should create passenger account com spy", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const sendSpy = jest.spyOn(MailerGatewayMemory.prototype, 'send')
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(sendSpy).toHaveBeenCalledTimes(1)
  expect(sendSpy).toHaveBeenCalledWith(input.email, "Welcome", "")
  jest.restoreAllMocks();
});

test.skip("Should create passenger account com mock", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const sendMock = jest.spyOn(MailerGatewayMemory.prototype, 'send').mockImplementation(async (email, subject, body) => { console.log("abc") });
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountDAO, mailerGateway);
  const getAccount = new GetAccount(accountDAO)
  const outputSignup = await signup.execute(input)
  expect(outputSignup).toHaveProperty('accountId')
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(sendMock).toHaveBeenCalledWith(input.email, 'Welcome', '');
  expect(sendMock).toHaveBeenCalledTimes(1);
  sendMock.mockRestore()
});