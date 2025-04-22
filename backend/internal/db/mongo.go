package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func GetFocFunEventsCollection() *mongo.Collection {
  collection := Db.Mongo.Database("foc_fun").Collection("events")
  if collection == nil {
    log.Fatal("Failed to get events collection")
  }
  return collection
}

func MongoInsertEvent(eventId int, eventKeys []string, eventData []string) (*mongo.InsertOneResult, error) {
  bsonData := bson.D{
    {"eventId", eventId},
    {"eventKeys", eventKeys},
    {"eventData", eventData},
  }
  res, err := GetFocFunEventsCollection().InsertOne(context.TODO(), bsonData)
  if err != nil {
    fmt.Println("Error inserting document: ", err)
    return nil, err
  }
  return res, nil
}

func MongoDeleteEvent(eventId int) (*mongo.DeleteResult, error) {
  filter := bson.D{{"eventId", eventId}}
  res, err := GetFocFunEventsCollection().DeleteOne(context.TODO(), filter)
  if err != nil {
    fmt.Println("Error deleting document: ", err)
    return nil, err
  }
  return res, nil
}

func MongoInsertJson(jsonData interface{}) (*mongo.InsertOneResult, error) {
  res, err := GetFocFunEventsCollection().InsertOne(context.TODO(), jsonData)
  if err != nil {
    fmt.Println("Error inserting document: ", err)
    return nil, err
  }
  return res, nil
}
