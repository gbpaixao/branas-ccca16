import pgPromise from "pg-promise";

export interface RideDAO {
  findRideById: (id: string) => Promise<any>
  findActiveRide: (passengerId: string) => Promise<any>
  createRide: (input: any) => Promise<any>
}

export class RideDAODatabase implements RideDAO {
  async findRideById(rideId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [ride] = await dbConnection.query("select * from ccca16.ride where ride_id = $1", [rideId]);
    await dbConnection.$pool.end();
    return ride
  }

  async findActiveRide(passengerId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [ride] = await dbConnection.query("select * from ccca16.ride where passenger_id = $1 and status <> 'completed' limit 1", [passengerId]);
    await dbConnection.$pool.end();
    return ride
  }

  async createRide(input: any) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const response = await dbConnection.query("insert into ccca16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [input.rideId, input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long, input.status, input.date]
    );
    await dbConnection.$pool.end();
    return response
  }
}

export class RideDAOMemory implements RideDAO {
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