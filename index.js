require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT || 5000;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

app.get("/", (req, res) => {
    res.send("RentWheels API is running");
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!",
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

// Create a new car
app.post("/cars", async (req, res) => {
    try {
        const carsCollection = db.collection("cars");
        const result = await carsCollection.insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all cars
app.get("/cars", async (req, res) => {
    try {
        const carsCollection = db.collection("cars");
        const cars = await carsCollection.find().toArray();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read one car by ID
app.get("/cars/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const carsCollection = db.collection("cars");
        const car = await carsCollection.findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!car) return res.status(404).json({ message: "Car not found" });
        res.json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a car by ID
app.put("/cars/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const carsCollection = db.collection("cars");
        const result = await carsCollection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: "after" },
        );
        if (!result.value)
            return res.status(404).json({ message: "Car not found" });
        res.json(result.value);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a car by ID
app.delete("/cars/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const carsCollection = db.collection("cars");
        const result = await carsCollection.findOneAndDelete({
            _id: new ObjectId(req.params.id),
        });
        if (!result.value)
            return res.status(404).json({ message: "Car not found" });
        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`rentWheels Server is running on http://localhost:${PORT}`);
});
