import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const mongoClient = new MongoClient(process.env.MONGO_URL);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("amigosecreto");
});

/* Leitura dos Participantes */
app.get("/", (req, res) => {
    db.collection("participantes").find().toArray().then(participants => {
        res.send(participants);
    });
});

/* Adicionar novo Participante */

app.post("/", (req, res) => {
    db.collection("participantes").insertOne(req.body).then(() => {
        res.sendStatus(201)
    })
})

/* Deletar um Participante */

app.delete("/:id", async (req,res) => {
    const { id } = req.params;
    try{
        const participant = await db.collection("participantes").findOne({ _id: new ObjectId(id) });
        if(!participant){
            res.sendStatus(404)
            return;
        }

        await db.collection("participantes").deleteOne({ _id: participant._id });
        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error)
    }

})

/* Deletar todos os participantes */

app.delete("/", (req, res) => {
    db.collection("participantes").deleteMany().then(() => {
        res.sendStatus(200)
    })
})

/* Alterar Participante */

app.put("/:id", async (req, res) => {
    const { id }  = req.params;

    try{
        const participant = await db.collection("participantes").findOne({ _id: new ObjectId(id) });
        if(!participant){
            res.sendStatus(404)
            return;
        }
    
        await db.collection("participantes").updateOne({ _id: participant._id }, { $set: req.body });

    res.sendStatus(200)

    } catch (error) {
        res.status(500).send(error)
    }

})


app.listen(4000, () => {
    console.log("Server is running on port 4000.")
});