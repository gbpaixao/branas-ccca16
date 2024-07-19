import { RideDAO } from "../resources/RideDAO"

export class GetRide {
  constructor(private readonly rideDAO: RideDAO) { }

  async execute(rideId: string) {
    const ride = await this.rideDAO.findRideById(rideId)
    return {
      ride: ride,
      passenger: ride.passengerId ?? ride.passenger_id,
      driver: null,
    }
  }
}