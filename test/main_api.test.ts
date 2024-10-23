import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Should create passenger account", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
  expect(responseSignup.status).toBe(200)
  expect(responseSignup.data).toHaveProperty('accountId')
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${responseSignup.data.accountId}`)
  expect(responseGetAccount.data.name).toBe(input.name)
  expect(responseGetAccount.data.email).toBe(input.email)
  expect(responseGetAccount.data.cpf).toBe(input.cpf)
  expect(responseGetAccount.data.isPassenger).toBe(input.isPassenger)
});

test("Should throw an error when creating account with an invalid name", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(422)
  expect(output.data).toBe("Invalid name")
});
