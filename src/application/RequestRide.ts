import { RideDAO } from "../resources/RideDAO";
import { GetAccount } from "./GetAccount";

export class RequestRide {
  constructor(private readonly getAccount: GetAccount, private readonly rideDAO: RideDAO) { }

  async execute(input: any) {
    const passenger = await this.getAccount.execute(input.passengerId)
    if (!passenger.isPassenger) throw new Error('User is not a passenger')
    const activeRide = await this.rideDAO.findActiveRide(input.passengerId)
    if (!!activeRide) throw new Error('Active ride on course')
    const ride = this.rideDAO.createRide({
      ...input,
      rideId: crypto.randomUUID(),
      status: "requested",
      date: new Date(),
    })
    return ride
  }
}