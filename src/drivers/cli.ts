import { Signup } from "../application/Signup"
import { AccountDAOMemory } from "../resources/AccountDAO"
import { MailerGatewayMemory } from "../resources/MailerGateway"

let input: any = {}
process.stdin.on("data", async (chunk) => {
  const command = chunk.toString().replace(/\n|\r/g, "")
  if(command.startsWith("name")) {
    input.name = command.replace("name ", "")
  }
  if(command.startsWith("email")) {
    input.email = command.replace("email ", "")
  }
  if(command.startsWith("cpf")) {
    input.cpf = command.replace("cpf ", "")
  }
  if(command.startsWith("signup")) {
    const accountDAO = new AccountDAOMemory()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const output = await signup.execute(input)
    console.log('output', output)
  }
})