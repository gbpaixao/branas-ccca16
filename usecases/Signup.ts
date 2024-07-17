import { createAccount, findAccountByEmail } from "../src/resources";
import { validateCpf } from "../src/validateCpf";

export class Signup {
  id: string;

  constructor(
    private readonly input: any,
  ) {
    this.id = crypto.randomUUID();
  }

  async execute() {
    const account = await findAccountByEmail(this.input.email)
    if (account) throw new Error("Email has already been registered")
    if (!this.isValidFullName()) throw new Error("Invalid name")
    if (!this.isValidEmail()) throw new Error("Invalid email")
    if (!validateCpf(this.input.cpf)) throw new Error("Invalid cpf")
    if (this.input.isDriver && !this.isValidCarPlate()) throw new Error("Invalid car plate")
    await createAccount({...this.input, id: this.id})
    return { accountId: this.id }
  }

  private isValidFullName() {
    return this.input.name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  private isValidEmail() {
    return this.input.email.match(/^(.+)@(.+)$/)
  }

  private isValidCarPlate() {
    return this.input.carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}