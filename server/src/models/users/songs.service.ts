
import e = require('express');

import { HttpResponse } from '../httpResponses/httpResponse.interface';
import { Song } from './song.interface';

var dbPool = require('../../database/database'); 

export const addLikedSong = async (userId: number, songId: number): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
      status_code: null,
      message: '',
      data: {}
  };

  // Check if the user exists
  let userCheckQuery = `SELECT id FROM users WHERE id = ?`;
  let userExists = await dbPool.query(userCheckQuery, [userId]);
  if (userExists.length === 0) {
      httpResponse.status_code = 404; // HTTP Not Found
      httpResponse.message = 'User not found.';
      httpResponse.data = {};
      return httpResponse;
  }

  // Check if the song exists
  let songCheckQuery = `SELECT id FROM songs WHERE id = ?`;
  let songExists = await dbPool.query(songCheckQuery, [songId]);
  if (songExists.length === 0) {
      httpResponse.status_code = 404; // HTTP Not Found
      httpResponse.message = 'Song not found.';
      httpResponse.data = {};
      return httpResponse;
  }

  // Check if the user already likes the song
  let likeCheckQuery = `SELECT * FROM user_songs WHERE user_id = ? AND song_id = ?`;
  let likeExists = await dbPool.query(likeCheckQuery, [userId, songId]);
  if (likeExists.length > 0) {
      httpResponse.status_code = 409; // HTTP Conflict
      httpResponse.message = 'User already likes this song.';
      httpResponse.data = {};
      return httpResponse;
  }

  // Add the liked song
  let insertQuery = `INSERT INTO user_songs (user_id, song_id) VALUES (?, ?)`;
  let result = await dbPool.query(insertQuery, [userId, songId]);
  if (result.affectedRows === 1) {
      httpResponse.status_code = 201; // HTTP Created
      httpResponse.message = 'Song added to user\'s likes successfully.';
      httpResponse.data = { userId: userId, songId: songId };
  } else {
      httpResponse.status_code = 500; // HTTP Internal Server Error
      httpResponse.message = 'Failed to add the song to user\'s likes.';
      httpResponse.data = {};
  }

  return httpResponse;
};


export const removeLikedSong = async (userId: number, songId: number): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
      status_code: null,
      message: '',
      data: {}
  };

  // Check if the user-song relationship exists
  let checkQuery = `SELECT * FROM user_songs WHERE user_id = ? AND song_id = ?`;
  let relationExists = await dbPool.query(checkQuery, [userId, songId]);
  if (relationExists.length === 0) {
      httpResponse.status_code = 404; // HTTP Not Found
      httpResponse.message = 'Liked song not found for this user.';
      httpResponse.data = {};
      return httpResponse;
  }

  // Remove the liked song
  let deleteQuery = `DELETE FROM user_songs WHERE user_id = ? AND song_id = ?`;
  let result = await dbPool.query(deleteQuery, [userId, songId]);
  if (result.affectedRows === 1) {
      httpResponse.status_code = 200; // HTTP OK
      httpResponse.message = 'Song removed from user\'s likes successfully.';
      httpResponse.data = { userId: userId, songId: songId };
  } else {
      httpResponse.status_code = 500; // HTTP Internal Server Error
      httpResponse.message = 'Failed to remove the song from user\'s likes.';
      httpResponse.data = {};
  }

  return httpResponse;
};


export const listLikedSongs = async (userId: number): Promise<HttpResponse> => {
  let httpResponse: HttpResponse = {
      status_code: null,
      message: '',
      data: {}
  };

  // Check if the user exists
  let userCheckQuery = `SELECT id FROM users WHERE id = ?`;
  let userExists = await dbPool.query(userCheckQuery, [userId]);
  if (userExists.length === 0) {
      httpResponse.status_code = 404; // HTTP Not Found
      httpResponse.message = 'User not found.';
      httpResponse.data = {};
      return httpResponse;
  }

  // Retrieve all liked songs for the user
  let likedSongsQuery = `SELECT s.id, s.name, s.created_at, s.updated_at FROM songs s 
                          JOIN user_songs us ON s.id = us.song_id 
                          WHERE us.user_id = ?`;
  let songs: Song[] = await dbPool.query(likedSongsQuery, [userId]);  // Typed as an array of Song
  if (songs.length > 0) {
      httpResponse.status_code = 200; // HTTP OK
      httpResponse.message = 'Successfully retrieved liked songs.';
      httpResponse.data = songs;  // Directly using typed array
  } else {
      httpResponse.status_code = 200; // No Content
      httpResponse.message = 'No songs found for this user.';
      httpResponse.data = [];
  }

  return httpResponse;
};