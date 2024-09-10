import { Account } from "../src/domain/Account";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";

test("Should create a record on 'account' table and find by id", async () => {
  const input = {
    accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: '',
		isPassenger: true,
		isDriver: false,
	};
  const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver)
  const accountRepository = new AccountRepositoryDatabase()
  await accountRepository.createAccount(account)
  const savedAccount = await accountRepository.findAccountById(account.accountId)
  expect(savedAccount.accountId).toBe(account.accountId)
  expect(savedAccount.name).toBe(account.name)
  expect(savedAccount.email).toBe(account.email)
  expect(savedAccount.cpf).toBe(account.cpf)
  expect(savedAccount.isPassenger).toBe(account.isPassenger)
})

test("Should create a record on 'account' table and find by email", async () => {
  const input = {
    accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: '',
		isPassenger: true,
		isDriver: false,
	};
  const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver)
  const accountRepository = new AccountRepositoryDatabase()
  await accountRepository.createAccount(account)
  const savedAccount = await accountRepository.findAccountByEmail(account.email)
  expect(savedAccount?.accountId).toBe(account.accountId)
  expect(savedAccount?.name).toBe(account.name)
  expect(savedAccount?.email).toBe(account.email)
  expect(savedAccount?.cpf).toBe(account.cpf)
  expect(savedAccount?.isPassenger).toBe(account.isPassenger)
})