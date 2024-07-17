export class GetAccount {
  constructor(private readonly email: string) {}

  async execute(dbConnection: any) {
    return await this.findAccount(dbConnection)
  }

  private async findAccount(dbConnection: any) {
    const [account] = await dbConnection.query("select * from ccca16.account where email = $1", [this.email]);
    return account
  }
}