import { AccountDAO } from "../resources/AccountDAO";
import { RideDAO } from "../resources/RideDAO";

export class GetRide {
  constructor(private readonly accountDAO: AccountDAO, private readonly rideDAO: RideDAO) { }

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideDAO.findRideById(input.rideId)
    const passenger = await this.accountDAO.findAccountById(ride.passenger_id)
    return {
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      fromLat: parseFloat(ride.from_lat),
      fromLong: parseFloat(ride.from_long),
      toLat: parseFloat(ride.to_lat),
      toLong: parseFloat(ride.to_long),
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