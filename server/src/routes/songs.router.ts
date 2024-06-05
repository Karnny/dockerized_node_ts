/**
 * Required External Modules and Interfaces
 */

import { Request, Response } from "express";
import * as express from "express";
import * as UserService from "../models/users/users.service";
import * as UserSongsService from "../models/users/songs.service";
import { HttpResponse } from "../models/httpResponses/httpResponse.interface";
import { User } from "models/users/user.interface";

/**
 * Router Definition
 */

export const SongsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET /users/:id/songs - List all liked songs by a user
SongsRouter.get("/:id/songs", async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id, 10);
    const httpResponse: HttpResponse = await UserSongsService.listLikedSongs(
      userId
    );
    res.status(httpResponse.status_code).send({
      message: httpResponse.message,
      data: httpResponse.data,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// POST /users/:userId/songs/:songId - Add a liked song for a user
SongsRouter.post(
  "/:userId/songs/:songId",
  async (req: Request, res: Response) => {
    const userId: number = parseInt(req.params.userId, 10);
    const songId: number = parseInt(req.params.songId, 10);
    try {
      const httpResponse: HttpResponse = await UserSongsService.addLikedSong(
        userId,
        songId
      );
      res.status(httpResponse.status_code).send({
        message: httpResponse.message,
        data: httpResponse.data,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// DELETE /users/:userId/songs/:songId - Remove a liked song from a user
SongsRouter.delete(
  "/:userId/songs/:songId",
  async (req: Request, res: Response) => {
    const userId: number = parseInt(req.params.userId, 10);
    const songId: number = parseInt(req.params.songId, 10);
    try {
      const httpResponse: HttpResponse = await UserSongsService.removeLikedSong(
        userId,
        songId
      );
      res.status(httpResponse.status_code).send({
        message: httpResponse.message,
        data: httpResponse.data,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);
