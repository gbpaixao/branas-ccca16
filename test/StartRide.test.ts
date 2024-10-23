import { AcceptRide } from '../src/application/usecase/AcceptRide';
import { GetRide } from '../src/application/usecase/GetRide';
import { RequestRide } from '../src/application/usecase/RequestRide';
import { Signup } from '../src/application/usecase/Signup';
import { StartRide } from '../src/application/usecase/StartRide';
import DatabaseConnection, { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';

let signup: Signup
let requestRide: RequestRide
let acceptRide: AcceptRide
let getRide: GetRide
let startRide: StartRide
let connection: DatabaseConnection

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase();
  const mailerGateway = new MailerGatewayMemory()
  signup = new Signup(accountRepository, mailerGateway);
  requestRide = new RequestRide(accountRepository, rideRepository)
  acceptRide = new AcceptRide(rideRepository, accountRepository)
  getRide = new GetRide(accountRepository, rideRepository)
  startRide = new StartRide(rideRepository)
})

test('Should start a ride', async () => {
  const driverSignupInput = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isDriver: true,
    carPlate: 'ABC1234'
  };
  const passengerSignupInput = {
    name: 'Jack Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  };
  const driverSignupOutput = await signup.execute(driverSignupInput)
  const passengerSignupOutput = await signup.execute(passengerSignupInput)
  const requestRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  const acceptRideInput = {
    rideId: requestRideOutput.rideId,
    driverId: driverSignupOutput.accountId
  }
  await acceptRide.execute(acceptRideInput.rideId, acceptRideInput.driverId)
  const startRideOutput = await startRide.execute(acceptRideInput.rideId)
  expect(startRideOutput).toBeUndefined()
  const ride = await getRide.execute({ rideId: acceptRideInput.rideId })
  expect(ride.status).toBe('in_progress')
})

test('Should not start a ride if it is not accepted', async () => {
  const passengerSignupInput = {
    name: 'Jack Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '87748248800',
    isPassenger: true
  };
  const passengerSignupOutput = await signup.execute(passengerSignupInput)
  const requestRideInput = {
    passengerId: passengerSignupOutput.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const requestRideOutput = await requestRide.execute(requestRideInput);
  await expect(() => startRide.execute(requestRideOutput.rideId)).rejects.toThrow("Ride is not accepted")
})