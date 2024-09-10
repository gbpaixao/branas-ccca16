import express from "express";
import { GetAccount } from "../application/GetAccount";
import { Signup } from "../application/Signup";
import { AccountRepositoryDatabase } from "../resources/AccountRepository";
import { MailerGatewayMemory } from "../resources/MailerGateway";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const accountRepository = new AccountRepositoryDatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountRepository, mailerGateway)
    const response = await signup.execute(req.body)
    return res.status(200).json(response)
  }
  catch (error) {
    if (error instanceof Error) return res.status(422).send(error.message)
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountRepository = new AccountRepositoryDatabase()
    const getAccount = new GetAccount(accountRepository)
    const response = await getAccount.execute(req.params.accountId)
    return res.json(response)
})

app.listen(3000);