// Framework and driver

import express from "express";

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: any, res: any) {
      try {
        const output = await callback(req.params, req.body)
        return res.json(output)
      } catch (error) {
        if (error instanceof Error) return res.status(422).send(error.message)
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port);
  }

}