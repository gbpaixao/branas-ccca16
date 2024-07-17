import { validateCpf } from "../src/validateCpf";
import { GetAccount } from "./GetAccount";

export class Signup {
  id: string;

  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly cpf: string,
    private readonly carPlate: string,
    private readonly password: string,
    private readonly isPassenger: string,
    private readonly isDriver: string,
  ) {
    this.id = crypto.randomUUID();
  }

  async execute(dbConnection: any) {
    const getAccount = new GetAccount(this.email)
    const account = await getAccount.execute(dbConnection)
    if (account) throw new Error("Email has already been registered")
    if (!this.isValidFullName()) throw new Error("Invalid name")
    if (!this.isValidEmail()) throw new Error("Invalid email")
    if (!validateCpf(this.cpf)) throw new Error("Invalid cpf")
    if (this.isDriver && !this.isValidCarPlate()) throw new Error("Invalid car plate")
    await this.insertDB(dbConnection)
    return { accountId: this.id }
  }

  private async insertDB(dbConnection: any) {
    await dbConnection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [this.id, this.name, this.email, this.cpf, this.carPlate, !!this.isPassenger, !!this.isDriver]
    );
  }

  private isValidFullName() {
    return this.name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  private isValidEmail() {
    return this.email.match(/^(.+)@(.+)$/)
  }

  private isValidCarPlate() {
    return this.carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}