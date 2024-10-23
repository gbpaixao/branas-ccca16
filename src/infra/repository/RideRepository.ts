// Interface adapter

import pgPromise from "pg-promise";
import Ride from "../../domain/Ride";

export interface RideRepository {
  findRideById: (id: string) => Promise<Ride>
  findActiveRideByPassenger: (passengerId: string) => Promise<Ride | null>
  findActiveRideByDriver: (driverId: string) => Promise<Ride | null>
  createRide: (input: Ride) => Promise<void>
  updateRide: (input: Ride) => Promise<Ride>
}

export class RideRepositoryDatabase implements RideRepository {
  async findRideById(rideId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [rideData] = await dbConnection.query("select * from ccca16.ride where ride_id = $1", [rideId]);
    await dbConnection.$pool.end();
    return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date, rideData.driver_id)
  }

  async findActiveRideByPassenger(passengerId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [rideData] = await dbConnection.query("select * from ccca16.ride where passenger_id = $1 and (status = 'requested' or status = 'in_progress') limit 1", [passengerId]);
    await dbConnection.$pool.end();
    if (rideData) return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date)
      else return null
  }

  async findActiveRideByDriver(driverId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [rideData] = await dbConnection.query("select * from ccca16.ride where driver_id = $1 and (status = 'accepted' or status = 'in_progress') limit 1", [driverId]);
    await dbConnection.$pool.end();
    if (rideData) return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date, rideData.driver_id)
      else return null
  }

  async createRide(input: Ride) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    await dbConnection.query("insert into ccca16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [input.rideId, input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong, input.status, input.date]
    );
    await dbConnection.$pool.end();
  }

  async updateRide(input: Ride): Promise<Ride> {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const ride = await dbConnection.query("update ccca16.ride set status = $1, driver_id = $2 where ride_id = $3",
      [input.status, input.driverId, input.rideId]
    );
    await dbConnection.$pool.end();
    return ride
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

  async findActiveRideByPassenger(passengerId: string) {
    return this.rides.find(ride => ride.passengerId === passengerId && (ride.status === "requested" || ride.status === 'in_progress'))
  }

  async findActiveRideByDriver(driverId: string) {
    return this.rides.find(ride => ride.driverId === driverId && (ride.status === "accepted" || ride.status === 'in_progress'))
  }

  async createRide(input: any): Promise<any> {
    this.rides.push(input)
    return input
  }

  async updateRide(input: any): Promise<any> {
    const rideIndex = this.rides.findIndex(ride => ride.id === input.id)
    this.rides[rideIndex] = input
    return input
  }
}