const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // TODO : Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username);

    // TODO : Bila verifikasi lolos, maka masukkan user baru ke database.
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.lenght) {
      throw new InvariantError('User failed to add..');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.lenght > 0) {
      throw new InvariantError('Failed to add user, username already in use..');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.lenght) {
      throw new NotFoundError('User not found..');
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.lenght) {
      throw new AuthenticationError('The credentials you provided are wrong..');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const math = await bcrypt.compare(password, hashedPassword);

    if (!math) {
      throw new AuthenticationError('The credentials you provided are incorrect');
    }

    return id;
  }
}

module.exports = UsersService;
