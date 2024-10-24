import { GetRide } from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { Signup } from "../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

let signup: Signup
let requestRide: RequestRide
let getRide: GetRide
let connection: DatabaseConnection

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase();
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountRepository, mailerGateway);
  requestRide = new RequestRide(accountRepository, rideRepository)
  getRide = new GetRide(accountRepository, rideRepository)
})

afterEach(() => {
  connection.close()
})

test("should request a new ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const signupOutput = await signup.execute(signupInput)
  const requestRideInput = {
    passengerId: signupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  expect(requestRideOutput.rideId).toBeDefined()
  const getRideInput = {
    rideId: requestRideOutput.rideId
  }
  const getRideOutput = await getRide.execute(getRideInput)
  expect(getRideOutput.rideId).toBe(getRideInput.rideId)
  expect(getRideOutput.passengerId).toBe(requestRideInput.passengerId)
  expect(getRideOutput.fromLat).toBe(requestRideInput.fromLat)
  expect(getRideOutput.fromLong).toBe(requestRideInput.fromLong)
  expect(getRideOutput.toLat).toBe(requestRideInput.toLat)
  expect(getRideOutput.toLong).toBe(requestRideInput.toLong)
  expect(getRideOutput.status).toBe("requested")
  expect(getRideOutput.passengerName).toBe(signupInput.name)
  expect(getRideOutput.passengerEmail).toBe(signupInput.email)
})

test("Should not request a ride to a user that is not a passenger", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: false
  };
  const signupOutput = await signup.execute(signupInput)
  const requestRideInput = {
    passengerId: signupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await expect(() => requestRide.execute(requestRideInput)).rejects.toThrow('User is not a passenger')
})

test("should not request a ride if there is an active ride", async () => {
  const signupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const signupOutput = await signup.execute(signupInput)
  const requestRideInput = {
    passengerId: signupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await requestRide.execute(requestRideInput);
  await expect(() => requestRide.execute(requestRideInput)).rejects.toThrow('Active ride on course')
})