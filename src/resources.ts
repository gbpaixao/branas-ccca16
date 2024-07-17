import pgPromise from "pg-promise";

export async function findAccountById(accountId: string) {
  const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
  const [account] = await dbConnection.query("select * from ccca16.account where account_id = $1", [accountId]);
  await dbConnection.$pool.end();
  return account
}

export async function findAccountByEmail(email: string) {
  const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
  const [account] = await dbConnection.query("select * from ccca16.account where email = $1", [email]);
  await dbConnection.$pool.end();
  return account
}

export async function createAccount(input: any) {
  const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
  const response = await dbConnection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
    [input.id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]
  );
  await dbConnection.$pool.end();
  return response
}