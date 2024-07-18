import express from "express";
import { Signup } from "../../usecases/Signup";
import { GetAccount } from "../application/GetAccount";
import { AccountDAODatabase } from "../resources/AccountDAO";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const accountDAO = new AccountDAODatabase()
    const signup = new Signup(accountDAO)
    const response = await signup.execute(req.body)
    return res.status(200).json(response)
  }
  catch (error) {
    if (error instanceof Error) return res.status(422).send(error.message)
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountDAO = new AccountDAODatabase()
    const getAccount = new GetAccount(accountDAO)
    const response = await getAccount.execute(req.params.accountId)
    return res.json(response)
})

app.listen(3000);