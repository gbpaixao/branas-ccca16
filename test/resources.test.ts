import { createAccount, findAccountByEmail, findAccountById } from "../src/resources";

test("Should create a record on 'account' table and find by id", async () => {
  const account = {
    id: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  await createAccount(account)
  const savedAccount = await findAccountById(account.id)
  expect(savedAccount.account_id).toBe(account.id)
  expect(savedAccount.name).toBe(account.name)
  expect(savedAccount.email).toBe(account.email)
  expect(savedAccount.cpf).toBe(account.cpf)
  expect(savedAccount.is_passenger).toBe(account.isPassenger)
})

test("Should create a record on 'account' table and find by email", async () => {
  const account = {
    id: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  await createAccount(account)
  const savedAccount = await findAccountByEmail(account.email)
  expect(savedAccount.account_id).toBe(account.id)
  expect(savedAccount.name).toBe(account.name)
  expect(savedAccount.email).toBe(account.email)
  expect(savedAccount.cpf).toBe(account.cpf)
  expect(savedAccount.is_passenger).toBe(account.isPassenger)
})