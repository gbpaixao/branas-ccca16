import { AccountDAODatabase } from "../src/resources/AccountDAO";

test("Should create a record on 'account' table and find by id", async () => {
  const account = {
    accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const accountDAO = new AccountDAODatabase()
  await accountDAO.createAccount(account)
  const savedAccount = await accountDAO.findAccountById(account.accountId)
  expect(savedAccount.account_id).toBe(account.accountId)
  expect(savedAccount.name).toBe(account.name)
  expect(savedAccount.email).toBe(account.email)
  expect(savedAccount.cpf).toBe(account.cpf)
  expect(savedAccount.is_passenger).toBe(account.isPassenger)
})

test("Should create a record on 'account' table and find by email", async () => {
  const account = {
    accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const accountDAO = new AccountDAODatabase()
  await accountDAO.createAccount(account)
  const savedAccount = await accountDAO.findAccountByEmail(account.email)
  expect(savedAccount.account_id).toBe(account.accountId)
  expect(savedAccount.name).toBe(account.name)
  expect(savedAccount.email).toBe(account.email)
  expect(savedAccount.cpf).toBe(account.cpf)
  expect(savedAccount.is_passenger).toBe(account.isPassenger)
})