const request = require('request');
const mysql   = require('mysql');

const dbconn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
});

console.info('Running database migrations...');

[
  `create database if not exists records`,
  `
    create table if not exists records (
      id int primary key auto_increment, 
      temperature decimal(11, 2), 
      humidity decimal(11, 2),
      createdAt datetime default current_timestamp
    )
  `,
].map(migration => dbconn.query(migration, (err) => err && console.error(err)));

const fetch = () => {
  console.info('Fetching current climate state');

  request
    .get(process.env.SENSOR_URL, (err, res, body) => {
      if (err) {
        return console.error(err);
      }

      try {
        const data = JSON.parse(body);
        console.info('Data fetched, persisting it to the db', data);

        dbconn.query('insert into records SET ?', data, (err) => {
          if (err) {
            console.error(err);
          }
        });

      } catch (e) {
        console.error(e);
      }
    })
  ;
};

setInterval(fetch, 10000);
