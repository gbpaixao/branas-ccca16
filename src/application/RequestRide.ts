import { AccountDAO } from "../resources/AccountDAO";
import { RideDAO } from "../resources/RideDAO";

export class RequestRide {
  constructor(private readonly accountDAO: AccountDAO, private readonly rideDAO: RideDAO) { }

  async execute(input: Input): Promise<Output> {
    const passenger = await this.accountDAO.findAccountById(input.passengerId)
    if (!passenger.is_passenger) throw new Error('User is not a passenger')
    const activeRide = await this.rideDAO.findActiveRide(input.passengerId)
    if (!!activeRide) throw new Error('Active ride on course')
    const ride = {
      rideId: crypto.randomUUID(),
      passengerId: input.passengerId,
      fromLat: input.fromLat,
      fromLong: input.fromLong,
      toLat: input.toLat,
      toLong: input.toLong,
      status: "requested",
      date: new Date(),
    }
    await this.rideDAO.createRide(ride)
    return {
      rideId: ride.rideId
    }
  }
}

type Input = {
  passengerId: string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
}

type Output = {
  rideId: string
}