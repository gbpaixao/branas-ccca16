import pgPromise from "pg-promise";

export interface RideDAO {
  createRide(ride: any): Promise<any>
  findRideById(id: string): Promise<any>
  findRideInProgressByPassenger(passengerId: string): Promise<any>
}

export class RideDAODatabase implements RideDAO {
  constructor() { }

  async createRide(input: any): Promise<any> {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    console.log('input', input)
    const [ride] = await dbConnection.query(
      "insert into ccca16.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_timestamp($11/1000.0))",
      [input.id, input.passengerId, input.driverId, input.status, null, null, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
    await dbConnection.$pool.end();
    console.log('ride', ride)
    return ride
  }

  async findRideById(id: string): Promise<any> {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [ride] = await dbConnection.query("select * from ccca16.ride where ride_id = $1", [id]);
    await dbConnection.$pool.end();
    return ride
  }

  async findRideInProgressByPassenger(passengerId: string): Promise<any> {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [ride] = await dbConnection.query("select * from ccca16.ride where ride_id = $1 and status <> 'completed'", [passengerId]);
    await dbConnection.$pool.end();
    return ride
  }

}

export class RideDAOMemory implements RideDAO {
  rides: any[]

  constructor() {
    this.rides = []
  }

  async createRide(ride: any): Promise<any> {
    this.rides.push(ride)
    return ride
  }

  async findRideById(id: string): Promise<any> {
    return this.rides.find(ride => ride.id === id)
  }

  async findRideInProgressByPassenger(passengerId: string): Promise<any> {
    return this.rides.find(ride => ride.passengerId === passengerId && ride.status !== "completed")
  }

}