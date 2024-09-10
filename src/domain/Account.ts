import { validateCpf } from "./validateCpf"

export class Account {
  private constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {
    if (!this.isValidFullName(this.name)) throw new Error("Invalid name")
    if (!this.isValidEmail(this.email)) throw new Error("Invalid email")
    if (!validateCpf(this.cpf)) throw new Error("Invalid cpf")
    if (this.isDriver && !this.isValidCarPlate(this.carPlate)) throw new Error("Invalid car plate")
  }

  // Static Factory Method
  static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
    const accountId = crypto.randomUUID()
    return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver)
  }

  // Static Factory Method
  static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
    return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver)
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