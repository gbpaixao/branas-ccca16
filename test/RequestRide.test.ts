import { GetRide } from "../src/application/GetRide";
import { RequestRide } from "../src/application/RequestRide";
import { AccountDAO, AccountDAOMemory } from "../src/resources/AccountDAO";
import { RideDAOMemory } from "../src/resources/RideDAO";

let accountDAO: AccountDAO
let requestRide: RequestRide
let getRide: GetRide

beforeAll(() => {
  accountDAO = new AccountDAOMemory();
  const rideDAO = new RideDAOMemory()
  requestRide = new RequestRide(accountDAO, rideDAO)
  getRide = new GetRide(rideDAO)
})

test("Should request a ride", async () => {
  const rideInput = {
    accountId: crypto.randomUUID(),
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  const passenger = {
    id: rideInput.accountId,
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  await accountDAO.createAccount(passenger)
  const ride = await requestRide.execute(rideInput)
  expect(ride).toHaveProperty('rideId')
  const savedRide = await getRide.execute(ride.rideId)
  expect(savedRide.ride.id).toBe(ride.rideId)
  expect(savedRide.ride.fromLat).toBe(rideInput.from.lat)
  expect(savedRide.ride.fromLong).toBe(rideInput.from.long)
  expect(savedRide.ride.toLat).toBe(rideInput.to.lat)
  expect(savedRide.ride.toLong).toBe(rideInput.to.long)
  expect(savedRide.passenger).toBe(rideInput.accountId)
  
})

test("Should throw an error when account is not a passenger", async () => {
  const input = {
    passengerId: crypto.randomUUID(),
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  await expect(requestRide.execute(input)).rejects.toThrow("Account is not a passenger")
})

test("Should throw an error when passenger has already another ride progress", async () => {
  const input = {
    accountId: crypto.randomUUID(),
    from: {
      lat: -40,
      long: -40
    },
    to: {
      lat: -41,
      long: -40
    }
  }
  const passenger = {
    id: input.accountId,
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  await accountDAO.createAccount(passenger)
  await requestRide.execute(input)
  await expect(requestRide.execute(input)).rejects.toThrow("There is already a ride in progress")
})