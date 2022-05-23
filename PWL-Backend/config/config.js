module.exports = {
  "development": {
    "username": "postgres",
    "password": "whatyourhopes123",
    "database": "pti06_database_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "whatyourhopes123",
    "database": "pti06_database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DATABASE_USERNAME,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require":true,
        "rejectUnauthorized":false
      }
    }
  }
}
