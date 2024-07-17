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
	const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(200)
  expect(output.data).toHaveProperty('accountId')
});

test("Should create driver account", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: 'QWE1234',
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(200)
  expect(output.data).toHaveProperty('accountId')
});


test("Should throw an error when creating driver account with an invalid car plate", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
    carPlate: 'QWER234',
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(422)
  expect(output.data).toBe(-5)
});

test("Should throw an error when creating account with an invalid cpf", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(422)
  expect(output.data).toBe(-1)
});

test("Should throw an error when creating account with an invalid email", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248801",
    carPlate: 'QWE1234',
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(422)
  expect(output.data).toBe(-2)
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
  expect(output.data).toBe(-3)
});

test("Should throw an error when creating account with an email already registered", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await axios.post("http://localhost:3000/signup", input);
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(422)
  expect(output.data).toBe(-4)
});