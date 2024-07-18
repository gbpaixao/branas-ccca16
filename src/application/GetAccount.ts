import { AccountDAO } from "../resources/AccountDAO";

export class GetAccount {
  constructor(private readonly accountDAO: AccountDAO) {}

  async execute(accountId: string) {
    return await this.accountDAO.findAccountById(accountId)
  }


}