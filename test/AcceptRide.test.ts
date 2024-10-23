import { AcceptRide } from "../src/application/usecase/AcceptRide"
import { GetRide } from "../src/application/usecase/GetRide"
import { RequestRide } from "../src/application/usecase/RequestRide"
import { Signup } from "../src/application/usecase/Signup"
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection"
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway"
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository"
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository"

let signup: Signup
let requestRide: RequestRide
let acceptRide: AcceptRide
let getRide: GetRide
let connection: DatabaseConnection

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase();
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountRepository, mailerGateway);
  requestRide = new RequestRide(accountRepository, rideRepository)
  acceptRide = new AcceptRide(rideRepository, accountRepository)
  getRide = new GetRide(accountRepository, rideRepository)
})

afterEach(() => {
  connection.close()
})

test("Should accept a ride", async () => {
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isDriver: true,
    carPlate: "ABC1234"
  };
  const passengerSignupInput = {
    name: "Jack Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const driverSignupOutput = await signup.execute(driverSignupInput)
  const passengerSignupOutput = await signup.execute(passengerSignupInput)
  const requestRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  const acceptRideInput = {
    rideId: requestRideOutput.rideId,
    driverId: driverSignupOutput.accountId
  }
  const acceptRideOutput = await acceptRide.execute(acceptRideInput.rideId, acceptRideInput.driverId)
  expect(acceptRideOutput).toBeUndefined()
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
  expect(getRideOutput.status).toBe("accepted")
  expect(getRideOutput.driverId).toBe(acceptRideInput.driverId)
})

test("Should not accept a ride if driver is not a driver", async () => {
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isDriver: false,
    carPlate: "ABC1234"
  };
  const passengerSignupInput = {
    name: "Jack Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const driverSignupOutput = await signup.execute(driverSignupInput)
  const passengerSignupOutput = await signup.execute(passengerSignupInput)
  const requestRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  const acceptRideInput = {
    rideId: requestRideOutput.rideId,
    driverId: driverSignupOutput.accountId
  }
  await expect(() => acceptRide.execute(acceptRideInput.rideId, acceptRideInput.driverId)).rejects.toThrow("Account is not a driver")
})

test("Should not accept a ride if driver already has an active ride", async () => {
  const driverSignupInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isDriver: true,
    carPlate: "ABC1234"
  };
  const passengerSignupInput = {
    name: "Jack Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const driverSignupOutput = await signup.execute(driverSignupInput)
  const passengerSignupOutput = await signup.execute(passengerSignupInput)
  const requestRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  const acceptRideInput = {
    rideId: requestRideOutput.rideId,
    driverId: driverSignupOutput.accountId
  }
  await acceptRide.execute(acceptRideInput.rideId, acceptRideInput.driverId)
  await expect(() => acceptRide.execute(acceptRideInput.rideId, acceptRideInput.driverId)).rejects.toThrow("Driver already has an active ride")
})