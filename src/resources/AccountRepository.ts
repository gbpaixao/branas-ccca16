import pgPromise from "pg-promise";
import { Account } from "../application/Account";

export interface AccountRepository {
  findAccountById(accountId: string): Promise<Account>;
  findAccountByEmail(email: string): Promise<Account | null>
  createAccount(input: Account): Promise<void>
}

export class AccountRepositoryDatabase implements AccountRepository {
  async findAccountById(accountId: string) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [account] = await dbConnection.query("select * from ccca16.account where account_id = $1", [accountId]);
    await dbConnection.$pool.end();
    return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver)
  }
  
  async findAccountByEmail(email: string): Promise<Account | null> {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    const [account] = await dbConnection.query("select * from ccca16.account where email = $1", [email]);
    await dbConnection.$pool.end();
    if (account) return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver)
    else return null
  }
  
  async createAccount(input: Account) {
    const dbConnection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
    await dbConnection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [input.accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]
    );
    await dbConnection.$pool.end();
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: any[]
  
  constructor() {
    this.accounts = []
  }
  
  findAccountById(accountId: string): Promise<any> {
    return this.accounts.find(account => account.accountId === accountId)
  }
  
  findAccountByEmail(email: string): Promise<any> {
    return this.accounts.find(account => account.email === email)
  }
  
  createAccount(input: any): Promise<any> {
    this.accounts.push(input)
    return input
  }
}