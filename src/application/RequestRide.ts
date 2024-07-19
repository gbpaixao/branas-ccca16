import { AccountDAO } from "../resources/AccountDAO"
import { RideDAO } from "../resources/RideDAO"

export class RequestRide {
  constructor(private readonly accountDAO: AccountDAO, private readonly rideDAO: RideDAO) { }

  async execute(input: any) {
    const { accountId, from, to } = input
    const passengerAccount = await this.accountDAO.findAccountById(accountId)
    if (!isPassenger(passengerAccount)) throw new Error("Account is not a passenger")
    const rideInProgress = await this.rideDAO.findRideInProgressByPassenger(passengerAccount.id)
    if (!!rideInProgress) throw new Error("There is already a ride in progress")
    const ride = {
      id: crypto.randomUUID(),
      status: "requested",
      date: new Date(),
      passengerId: passengerAccount.id,
      driverId: null,
      fromLat: from.lat,
      fromLong: from.long,
      toLat: to.lat,
      toLong: to.long
    }
    await this.rideDAO.createRide(ride)
    return { rideId: ride.id }
  }
}

function isPassenger(account: any) { return !!account?.isPassenger } 