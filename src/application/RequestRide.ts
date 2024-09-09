import { AccountDAO } from "../resources/AccountDAO";
import { RideRepository } from "../resources/RideRepository";
import Ride from "./Ride";

export class RequestRide {
  constructor(private readonly accountDAO: AccountDAO, private readonly rideRepository: RideRepository) { }

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountDAO.findAccountById(input.passengerId)
    if (!passenger.is_passenger) throw new Error('User is not a passenger')
    const activeRide = await this.rideRepository.findActiveRide(input.passengerId)
    if (!!activeRide) throw new Error('Active ride on course')
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    )
    await this.rideRepository.createRide(ride)
    return {
      rideId: ride.rideId
    }
  }
}

// DTO
type Input = {
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
}

// DTO
type Output = {
  rideId: string
}