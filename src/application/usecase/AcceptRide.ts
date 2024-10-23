import Ride from "../../domain/Ride";
import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository
  ) { }

  async execute(ride_id: string, driver_id: string): Promise<void> {
    const driver = await this.accountRepository.findAccountById(driver_id);
    if (driver.isDriver === false) throw new Error("Account is not a driver");
    const ride = await this.rideRepository.findRideById(ride_id);
    if (!ride) throw new Error("Ride not found");
    const activeRide = await this.rideRepository.findActiveRideByDriver(driver_id);
    if (!!activeRide) throw new Error("Driver already has an active ride");
    const updatedRide = Ride.restore(ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, "accepted", ride.date, driver_id);
    await this.rideRepository.updateRide(updatedRide);
  }
}