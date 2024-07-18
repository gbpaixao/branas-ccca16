import { AccountDAO } from "../resources/AccountDAO";
import { MailerGateway } from "../resources/MailerGateway";
import { validateCpf } from "./validateCpf";

export class Signup {
  constructor(
    private readonly accountDAO: AccountDAO,
    private readonly mailerGateway: MailerGateway,
  ) {}

  async execute(input: any) {
    const account = input
    account.id = crypto.randomUUID()
    const existingAccount = await this.accountDAO.findAccountByEmail(account.email)
    if (existingAccount) throw new Error("Account already exists")
    if (!this.isValidFullName(account.name)) throw new Error("Invalid name")
    if (!this.isValidEmail(account.email)) throw new Error("Invalid email")
    if (!validateCpf(account.cpf)) throw new Error("Invalid cpf")
    if (account.isDriver && !this.isValidCarPlate(account.carPlate)) throw new Error("Invalid car plate")
    await this.accountDAO.createAccount(account)
  await this.mailerGateway.send(account.email, 'Welcome', "")
    return { accountId: account.id }
  }

  private isValidFullName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  private isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  private isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}