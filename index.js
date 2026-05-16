const { ObjectId } = require("mongodb");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const client = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database
async function run() {
    try {
        // connect db
        await client.connect();

        console.log("MongoDB Connected");

        // collections
        const carsCollection = client.db("rentWheelsDB").collection("cars");

        const bookingsCollection = client
            .db("rentWheelsDB")
            .collection("bookings");

        // CAR APIs

        // get all cars
        app.get("/cars", async (req, res) => {
            const result = await carsCollection.find().toArray();

            res.send(result);
        });

        // get single car
        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;

            const query = {
                _id: new ObjectId(id),
            };

            const result = await carsCollection.findOne(query);

            res.send(result);
        });

        // add car
        app.post("/cars", async (req, res) => {
            const newCar = req.body;

            const result = await carsCollection.insertOne(newCar);

            res.send(result);
        });

        // update car
        app.put("/cars/:id", async (req, res) => {
            const id = req.params.id;

            const updatedCar = req.body;

            const query = {
                _id: new ObjectId(id),
            };

            const updatedDoc = {
                $set: {
                    carName: updatedCar.carName,
                    description: updatedCar.description,
                    category: updatedCar.category,
                    price: updatedCar.price,
                    location: updatedCar.location,
                    image: updatedCar.image,
                    status: updatedCar.status,
                },
            };

            const result = await carsCollection.updateOne(query, updatedDoc);

            res.send(result);
        });

        // delete car
        app.delete("/cars/:id", async (req, res) => {
            const id = req.params.id;

            const query = {
                _id: new ObjectId(id),
            };

            const result = await carsCollection.deleteOne(query);

            res.send(result);
        });

        // BOOKING APIs

        // create booking
        app.post("/bookings", async (req, res) => {
            const bookingData = req.body;

            const result = await bookingsCollection.insertOne(bookingData);

            res.send(result);
        });

        // get bookings by email
        app.get("/bookings", async (req, res) => {
            const email = req.query.email;

            const query = {
                bookingUserEmail: email,
            };

            const result = await bookingsCollection.find(query).toArray();

            res.send(result);
        });

        // my bookings by email => This fetches only logged-in user's cars.

        app.get("/my-cars", async (req, res) => {
            const email = req.query.email;

            const query = {
                providerEmail: email,
            };

            const result = await carsCollection.find(query).toArray();

            res.send(result);
        });

        // test route
        app.get("/", (req, res) => {
            res.send("RentWheels Server Running");
        });

        // ping route for health check
        app.get("/ping", async (req, res) => {
            try {
                await client.db("rentWheelsDB").command({ ping: 1 });
                res.send({ success: true, message: "Ping successful" });
            } catch (error) {
                res.status(500).send({
                    success: false,
                    message: "Ping failed",
                    error: error.message,
                });
            }
        });
    } finally {
    }
}

// listen only after run() completes
run()
    .then(() => {
        app.listen(port, () => {
            console.log(
                `rentWheels Server is running on http://localhost:${port}`,
            );
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });
