import { AccountDAO } from "../src/resources";
import { validateCpf } from "../src/validateCpf";

export class Signup {
  id: string;

  constructor(
    private readonly accountDAO: AccountDAO,
  ) {
    this.id = crypto.randomUUID();
  }

  async execute(input: any) {
    const existingAccount = await this.accountDAO.findAccountByEmail(input.email)
    if (existingAccount) throw new Error("Account already exists")
    if (!this.isValidFullName(input.name)) throw new Error("Invalid name")
    if (!this.isValidEmail(input.email)) throw new Error("Invalid email")
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf")
    if (input.isDriver && !this.isValidCarPlate(input.carPlate)) throw new Error("Invalid car plate")
    await this.accountDAO.createAccount({...input, id: this.id})
    return { accountId: this.id }
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