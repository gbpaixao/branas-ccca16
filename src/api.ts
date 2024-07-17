import pgp from "pg-promise";
import express from "express";
import { Signup } from "../usecases/Signup";
import { GetAccount } from "../usecases/GetAccount";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const signup = new Signup(req.body)
  const dbConnection = pgp()("postgres://postgres:postgres@localhost:5432/ccca16");
  try {
    const response = await signup.execute(dbConnection)
    return res.status(200).json(response)
  }
  catch (error) {
    if (error instanceof Error) return res.status(422).send(error.message)
  }
  finally {
    await dbConnection.$pool.end();
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const dbConnection = pgp()("postgres://postgres:postgres@localhost:5432/ccca16");
  try {
    const getAccount = new GetAccount()
    const response = await getAccount.execute(dbConnection, req.params.accountId)
    return res.json(response)
  } finally {
    await dbConnection.$pool.end();
  }
})

app.listen(3000);