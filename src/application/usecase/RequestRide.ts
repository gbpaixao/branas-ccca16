import Ride from "../../domain/Ride";
import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class RequestRide {
  constructor(private readonly accountRepository: AccountRepository, private readonly rideRepository: RideRepository) { }

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountRepository.findAccountById(input.passengerId)
    if (!passenger.isPassenger) throw new Error('User is not a passenger')
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