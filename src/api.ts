import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
const app = express();
app.use(express.json());

const isValidFullName = (name: string) => {
  return name.match(/[a-zA-Z] [a-zA-Z]+/)
}
function isValidEmail(email: string) {
  return email.match(/^(.+)@(.+)$/)
}
function isValidCarPlate(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/)
}
app.post("/signup", async function (req, res) {
  const connection = pgp()("postgres://postgres:postgres@localhost:5432/ccca16");
  try {
    const id = crypto.randomUUID();
    const [account] = await connection.query("select * from ccca16.account where email = $1", [req.body.email]);
    if (account) {
      return res.status(422).send("-4");
    }
    if (!isValidFullName(req.body.name)) {
      return res.status(422).send("-3");
    }
    if (!isValidEmail(req.body.email)) {
      return res.status(422).send("-2");
    }
    if (!validateCpf(req.body.cpf)) {
      return res.status(422).send("-1");
    }
    if (req.body.isDriver && !isValidCarPlate(req.body.carPlate)) {
      return res.status(422).send("-5");
    }
    await connection.query("insert into ccca16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);
    return res.json({ accountId: id })

  } finally {
    await connection.$pool.end();
  }
});

app.listen(3000);