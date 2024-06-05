require("dotenv").config();

import express from "express";
import cors from "cors";

// ======== Routes =========
import { UsersRouter } from "./routes/users.router";
import { SongsRouter } from "./routes/songs.router";


class App {
  
  public express: express.Application;
  
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(cors({ origin: "*" }));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }
  
  private routes(): void {
    let router = express.Router();

    router.get("/", (req, res) => {
      res.json({
        message: "OK",
      });
    });

    this.express.use("/", router);
    this.express.use("/users", UsersRouter);
    this.express.use("/users", SongsRouter);
    
  }
}
export default new App().express;
