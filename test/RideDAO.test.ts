import { GetRide } from "../src/application/GetRide"
import { RideDAODatabase } from "../src/resources/RideDAO"

test("Should create a record on 'ride' table and find by id", async () => {
  const input = {
    id: crypto.randomUUID(),
    status: "requested",
    date: new Date().valueOf(),
    passengerId: crypto.randomUUID(),
    driverId: null,
    fromLat: -40,
    fromLong: -40,
    toLat: -40,
    toLong: -41
  }
  const rideDAO = new RideDAODatabase()
  await rideDAO.createRide(input)
  const getRide = new GetRide(rideDAO)
  const { ride, passenger, driver } = await getRide.execute(input.id)
  expect(passenger).toBe(input.passengerId)
  expect(driver).toBe(null)
  expect(ride.ride_id).toBe(input.id)
  expect(parseInt(ride.from_lat)).toBe(input.fromLat)
  expect(parseInt(ride.from_long)).toBe(input.fromLong)
  expect(parseInt(ride.to_lat)).toBe(input.toLat)
  expect(parseInt(ride.to_long)).toBe(input.toLong)
})