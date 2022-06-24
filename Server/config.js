//DATABASE CONNECTION
const db = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    }
  })
  db.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
 })
 .catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
 });

 module.exports = db;