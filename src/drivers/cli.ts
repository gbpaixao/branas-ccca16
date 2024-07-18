import { Signup } from "../application/Signup"
import { AccountDAOMemory } from "../resources/AccountDAO"
import { MailerGatewayMemory } from "../resources/MailerGateway"

let input: any = {}
let step = ""
process.stdin.on("data", async (chunk) => {
  const command = chunk.toString().replace(/\n|\r/g, "")
  if(command.startsWith("signup-passenger")) {
    process.stdout.write("passenger-name: ")
    step = "name"
    return;
  }
  if (step === "name") {
    input[step] = command
    process.stdout.write("passenger-email: ")
    step = "email"
    return;
  }
  if (step === "email") {
    input[step] = command
    process.stdout.write("passenger-cpf: ")
    step = "cpf"
    return;
  }
  if (step === "cpf") {
    input[step] = command
    
    const accountDAO = new AccountDAOMemory()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const output = await signup.execute(input)
    console.log('output', output)
  }
})