import pgPromise from "pg-promise";

export interface AccountDAO {
  findAccountById(accountId: string): Promise<any>;
  findAccountByEmail(email: string): Promise<any>
  createAccount(input: any): Promise<any>
}

export class AccountDAODatabase implements AccountDAO {
  async findAccountById(accountId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [account] = await dbConnection.query("select * from ccca16.account where account_id = $1", [accountId]);
    await dbConnection.$pool.end();
    return account
  }
  
  async findAccountByEmail(email: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [account] = await dbConnection.query("select * from ccca16.account where email = $1", [email]);
    await dbConnection.$pool.end();
    return account
  }
  
  async createAccount(input: any) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const response = await dbConnection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [input.id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]
    );
    await dbConnection.$pool.end();
    return response
  }
}

export class AccountDAOMemory implements AccountDAO {
  accounts: any[]
  
  constructor() {
    this.accounts = []
  }
  
  findAccountById(accountId: string): Promise<any> {
    return this.accounts.find(account => account.id === accountId)
  }
  
  findAccountByEmail(email: string): Promise<any> {
    return this.accounts.find(account => account.email === email)
  }
  
  createAccount(input: any): Promise<any> {
    this.accounts.push(input)
    return input
  }
}