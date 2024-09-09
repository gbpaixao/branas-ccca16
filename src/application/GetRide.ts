import { AccountDAO } from "../resources/AccountDAO";
import { RideDAO } from "../resources/RideDAO";

export class GetRide {
  constructor(private readonly accountDAO: AccountDAO, private readonly rideDAO: RideDAO) { }

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideDAO.findRideById(input.rideId)
    const passenger = await this.accountDAO.findAccountById(ride.passengerId)
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