package db

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/b-j-roberts/foc-fun/backend/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Databases struct {
	Postgres *pgxpool.Pool
  Mongo   *mongo.Client
}

var Db *Databases

func InitDB() {
	Db = &Databases{}

	postgresConnString := "postgresql://" + config.Conf.Postgres.User + ":" + os.Getenv("POSTGRES_PASSWORD") + "@" + config.Conf.Postgres.Host + ":" + strconv.Itoa(config.Conf.Postgres.Port) + "/" + config.Conf.Postgres.Name
	pgPool, err := pgxpool.New(context.Background(), postgresConnString)
	if err != nil {
		fmt.Println("Error connecting to database: ", err)
		os.Exit(1)
	}
	Db.Postgres = pgPool

  mongoUri := os.Getenv("MONGO_URI")
  if mongoUri == "" {
    fmt.Println("MONGO_URI environment variable not set")
    os.Exit(1)
  }
  mongoClient, err := mongo.Connect(options.Client().ApplyURI(mongoUri))
  if err != nil {
    fmt.Println("Error connecting to MongoDB: ", err)
    os.Exit(1)
  }
  Db.Mongo = mongoClient
}

func CloseDB() {
	Db.Postgres.Close()
  Db.Mongo.Disconnect(context.TODO())
}
