import { GetAccount } from "../src/application/GetAccount"
import { RequestRide } from "../src/application/RequestRide"
import { Signup } from "../src/application/Signup"
import { AccountDAOMemory } from "../src/resources/AccountDAO"
import { MailerGatewayMemory } from "../src/resources/MailerGateway"
import { RideDAOMemory } from "../src/resources/RideDAO"

let signup: Signup
let getAccount: GetAccount

beforeEach(async () => {
  const accountDAO = new AccountDAOMemory()
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO)
})

test("should create a new ride", async () => {
  const passengerInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const passenger = await signup.execute(passengerInput)
  const rideInput = {
    passengerId: passenger.accountId,
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  const rideDAO = new RideDAOMemory()
  const requestRide = new RequestRide(getAccount, rideDAO)
  const outputRide = await requestRide.execute(rideInput)
  expect(outputRide).toHaveProperty('rideId')
  expect(outputRide.status).toBe("requested")
  expect(outputRide.passengerId).toBe(passenger.accountId)
})

test("should throw if account is not a passenger", async () => {
  const passengerInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: false
  };
  const passenger = await signup.execute(passengerInput)
  const rideInput = {
    passengerId: passenger.accountId,
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  const rideDAO = new RideDAOMemory()
  const requestRide = new RequestRide(getAccount, rideDAO)
  await expect(() => requestRide.execute(rideInput)).rejects.toThrow('User is not a passenger')
})

test("should throw if there is already an active ride", async () => {
  const passengerInput = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const passenger = await signup.execute(passengerInput)
  const rideInput = {
    passengerId: passenger.accountId,
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  const rideDAO = new RideDAOMemory()
  const requestRide = new RequestRide(getAccount, rideDAO)
  await requestRide.execute(rideInput)
  await expect(() => requestRide.execute(rideInput)).rejects.toThrow('Active ride on course')
})