const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const newAlbum = {
      name, year, id, createdAt, updateAt,
    };

    this._albums.push(newAlbum);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album failed to add..');
    }

    return id;
  }

  getAlbumById(id) {
    const album = this._albums.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Album not found..');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Failed to update album, id not found..');
    }

    const updateAt = new Date().toISOString();

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
      updateAt,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Album failed to delete, id not found..');
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
