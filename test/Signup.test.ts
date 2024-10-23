
import { GetAccount } from "../src/application/usecase/GetAccount";
import { Signup } from "../src/application/usecase/Signup";
import { Account } from "../src/domain/Account";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/infra/repository/AccountRepository";

let signup: Signup
let getAccount: GetAccount
let connection: DatabaseConnection

beforeEach(async () => {
  const accountRepository = new AccountRepositoryMemory()
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository)
  connection = new PgPromiseAdapter()
})

afterEach(() => {
  connection.close()
})

test("Should create passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: '',
    isPassenger: true,
    isDriver: false
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
    carPlate: '',
    isPassenger: true,
    isDriver: false
  };
  const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver)
  const createAccountStub = jest.spyOn(AccountRepositoryDatabase.prototype, 'createAccount').mockResolvedValue()
  const findAccountByEmailStub = jest.spyOn(AccountRepositoryDatabase.prototype, 'findAccountByEmail').mockResolvedValue(null)
  const findAccountByIdStub = jest.spyOn(AccountRepositoryDatabase.prototype, 'findAccountById').mockResolvedValue(account)
  const accountRepository = new AccountRepositoryDatabase(connection)
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository)
  const outputSignup = await signup.execute(account)
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
  const accountRepository = new AccountRepositoryDatabase(connection)
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository)
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

test("Should create passenger account com mock", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const sendMock = jest.spyOn(MailerGatewayMemory.prototype, 'send').mockImplementation(async (email, subject, body) => { console.log("abc") });
  const accountRepository = new AccountRepositoryDatabase(connection)
  const mailerGateway = new MailerGatewayMemory()
  const signup = new Signup(accountRepository, mailerGateway);
  const getAccount = new GetAccount(accountRepository)
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