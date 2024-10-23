import Ride from "../../domain/Ride";
import { RideRepository } from "../../infra/repository/RideRepository";

export class StartRide {
  constructor(private readonly rideRepository: RideRepository) { }

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.findRideById(rideId);
    if (ride.status !== 'accepted') throw new Error('Ride is not accepted');
    const updatedRide = Ride.restore(ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, 'in_progress', new Date(), ride.driverId);
    await this.rideRepository.updateRide(updatedRide);
  }
}