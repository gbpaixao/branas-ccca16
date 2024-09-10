import { AccountRepository } from "../resources/AccountRepository";
import { RideRepository } from "../resources/RideRepository";

export class GetRide {
  constructor(private readonly accountRepository: AccountRepository, private readonly rideRepository: RideRepository) { }

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.findRideById(input.rideId)
    const passenger = await this.accountRepository.findAccountById(ride.passengerId)
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.status,
      passengerName: passenger.name,
      passengerEmail: passenger.email,
    }
  }
}

type Input = {
  rideId: string
}

type Output = {
  rideId: string
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  passengerName: string
  passengerEmail: string
}