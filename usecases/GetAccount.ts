import { AccountDAODatabase } from "../src/resources";

export class GetAccount {
  constructor(private readonly accountDAO: AccountDAODatabase) {}

  async execute(accountId: string) {
    return await this.accountDAO.findAccountById(accountId)
  }


}