require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/album/albumindex');
const AlbumsService = require('./service/postgres/AlbumsService');
const AlbumsValidator = require('./validator/album/albumindex');

const songs = require('./api/song/songindex');
const SongsService = require('./service/postgres/SongsService');
const SongsValidator = require('./validator/song/songindex');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
