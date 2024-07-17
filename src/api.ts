import express from "express";
import { Signup } from "../usecases/Signup";
import { GetAccount } from "../usecases/GetAccount";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const signup = new Signup(req.body)
    const response = await signup.execute()
    return res.status(200).json(response)
  }
  catch (error) {
    if (error instanceof Error) return res.status(422).send(error.message)
  }
});

app.get("/accounts/:accountId", async function (req, res) {
    const getAccount = new GetAccount()
    const response = await getAccount.execute(req.params.accountId)
    return res.json(response)
})

app.listen(3000);