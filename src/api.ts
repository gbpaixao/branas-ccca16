import pgp from "pg-promise";
import express from "express";
import { Signup } from "../usecases/Signup";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const { name, email, cpf, carPlate, password, isPassenger, isDriver } = req.body
  const signup = new Signup(name, email, cpf, carPlate, password, isPassenger, isDriver)
  const dbConnection = pgp()("postgres://postgres:postgres@localhost:5432/ccca16");
  try {
    const response = await signup.execute(dbConnection)
    if (response.status === 422) return res.status(response.status).send(response.error)
    else return res.status(200).json({ accountId: response.accountId })
  }
  finally {
    await dbConnection.$pool.end();
  }
});

app.listen(3000);