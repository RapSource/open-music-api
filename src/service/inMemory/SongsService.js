const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const song_id = nanoid(16);
    const createdAt = new Date().toISOString;
    const updateAt = createdAt;

    const newSong = {
      title, year, genre, performer, duration, albumId, song_id, createdAt, updateAt,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === song_id).length > 0;

    if (isSuccess) {
      throw new InvariantError('Song failed to add..');
    }

    return song_id;
  }

  getAllSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Song not found..');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Failed to update song, id not found..');
    }
    const updateAt = new Date().toISOString();

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      updateAt,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Song failed to delete, id not found..');
    }

    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
