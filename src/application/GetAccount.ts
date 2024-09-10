import { AccountRepository } from "../resources/AccountRepository";

export class GetAccount {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(accountId: string) {
    return await this.accountRepository.findAccountById(accountId)
  }
}