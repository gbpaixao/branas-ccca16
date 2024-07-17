import { validateCpf } from "../src/validateCpf";
import { GetAccount } from "./GetAccount";

export class Signup {
  id: string;

  constructor(
    private readonly input: any,
  ) {
    this.id = crypto.randomUUID();
  }

  async execute(dbConnection: any) {
    const getAccount = new GetAccount()
    const account = await getAccount.findAccountByEmail(dbConnection, this.input.email)
    if (account) throw new Error("Email has already been registered")
    if (!this.isValidFullName()) throw new Error("Invalid name")
    if (!this.isValidEmail()) throw new Error("Invalid email")
    if (!validateCpf(this.input.cpf)) throw new Error("Invalid cpf")
    if (this.input.isDriver && !this.isValidCarPlate()) throw new Error("Invalid car plate")
    await this.insertDB(dbConnection)
    return { accountId: this.id }
  }

  private async insertDB(dbConnection: any) {
    await dbConnection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [this.id, this.input.name, this.input.email, this.input.cpf, this.input.carPlate, !!this.input.isPassenger, !!this.input.isDriver]
    );
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