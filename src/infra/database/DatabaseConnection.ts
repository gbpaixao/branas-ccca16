// Framework and driver
import pgPromise from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any

  constructor() {
    this.connection = pgPromise()("postgres://postgres:postgres@localhost:5432/ccca16");
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    return this.connection.$pool.end()
  }
}