import pgPromise from "pg-promise";
import Ride from "../../domain/Ride";

export interface RideRepository {
  findRideById: (id: string) => Promise<Ride>
  findActiveRide: (passengerId: string) => Promise<Ride | null>
  createRide: (input: Ride) => Promise<void>
}

export class RideRepositoryDatabase implements RideRepository {
  async findRideById(rideId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [rideData] = await dbConnection.query("select * from ccca16.ride where ride_id = $1", [rideId]);
    await dbConnection.$pool.end();
    return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date)
  }

  async findActiveRide(passengerId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [rideData] = await dbConnection.query("select * from ccca16.ride where passenger_id = $1 and status <> 'completed' limit 1", [passengerId]);
    await dbConnection.$pool.end();
    if (rideData) return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date)
      else return null
  }

  async createRide(input: Ride) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    await dbConnection.query("insert into ccca16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [input.rideId, input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong, input.status, input.date]
    );
    await dbConnection.$pool.end();
  }
}

export class RideRepositoryMemory implements RideRepository {
  rides: any[]

  constructor() {
    this.rides = []
  }

  async findRideById(rideId: string) {
    return this.rides.find(ride => ride.id === rideId)
  }

  async findActiveRide(passengerId: string) {
    return this.rides.find(ride => ride.passengerId === passengerId && ride.status !== "completed")
  }

  async createRide(input: any): Promise<any> {
    this.rides.push(input)
    return input
  }
}