export class GetAccount {
  constructor() {}

  async execute(dbConnection: any, accountId: string) {
    return await this.findAccount(dbConnection, accountId)
  }

  private async findAccount(dbConnection: any, accountId: string) {
    const [account] = await dbConnection.query("select * from ccca16.account where account_id = $1", [accountId]);
    return account
  }

  async findAccountByEmail(dbConnection: any, email: string) {
    const [account] = await dbConnection.query("select * from ccca16.account where email = $1", [email]);
    return account
  }
}