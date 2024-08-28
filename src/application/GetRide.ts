import { RideDAO } from "../resources/RideDAO";

export class GetAccount {
  constructor(private readonly rideDAO: RideDAO) { }

  async execute(rideId: string) {
    return await this.rideDAO.findRideById(rideId)
  }
}