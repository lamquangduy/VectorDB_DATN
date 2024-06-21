import os
import pymongo
import pandas as pd
from bson.json_util import dumps


MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", "27017")
MONGO_USER = os.environ.get("MONGO_USER", "admin")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "Abc12345")

mongo_client = pymongo.MongoClient(
    f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/"
)

db = mongo_client["chatbot"]
collection = db["chat_role"]
collection.find_one_and_update(
            {"email": "huutai1515225@gmail.com", "role":"admin" },
            {"$set":{"email": "huutai1515225@gmail.com", "role":"admin" }},
            upsert=True,
        )