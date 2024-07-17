import { findAccountById } from "../src/resources";

export class GetAccount {
  constructor() {}

  async execute(accountId: string) {
    return await findAccountById(accountId)
  }


}