import knex from 'knex';
import path from 'path';

const knexConfig = require(path.join(__dirname, '../../knexfile.js'));

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

export const db = knex(config);

export default db;
