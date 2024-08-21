require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const twilio = require('twilio');
const mongoose = require('mongoose');


const app = express();
const port = 5555;

const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTH_TOKEN_TWILIO;
const client = twilio(accountSid, authToken);

const mongoUri = "mongodb+srv://reyesrepair:zkRvNE4niv9t8CAE@comments.8sa4ozf.mongodb.net/?retryWrites=true&w=majority&appName=Comments";

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB Atlas:', error);
    });

const comentarioSchema = new mongoose.Schema({
    name: String,
    comment: String,
    rating: Number
});

const Comentario = mongoose.model('Comentario', comentarioSchema);


app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api-key', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey) {
        res.json({ apiKey });
    } else {
        console.error('API key not found');
        res.status(500).json({ error: 'API key not found' });
    }
    
});


app.post('/send-message', (req, res) => {

    const { name, email, phone, date, time } = req.body;

    const messageBody = `Hola ${name}, tu cita está confirmada para el ${date} a las ${time}. Gracias por elegir Reyes Auto Repair.`;

    const numerosDestinatarios =  [`+1${phone}`, '+14086246276', '+14084606104']

    //Funcion para enviar mensaje a cada numero

    const sendMessages = () => {
        const promises = numerosDestinatarios.map(numero =>{
            return client.messages.create({
                body: messageBody,
                from: '+18445611302',
                to: numero
            });
        });
        return Promise.all(promises);
    };

    sendMessages()
        .then(messages=>{
            messages.forEach(message => console.log(message.sid));
            res.json({ success:true});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({success:false, error: 'Failed to Send Message'})
        });

});

//Endpoint para obtener los comentarios
app.get('/comments', async (req, res) => {
    try{
        const comentarios = await Comentario.find();
        console.log(comentarios);
        res.json(comentarios);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
});

//Endpoint para enviar un comentario
app.post('/comments', async (req, res) =>{
    const { name, comment, rating } = req.body;

    const nuevoComentario = new Comentario({name, comment, rating});

    try {
        await nuevoComentario.save();
        res.json({ success: true });

    }catch (error) {
        res.status(500).json({ success: false, error: 'Error al enviar comentario' });
    }
});

app.listen(port,() =>{
    console.log(`Server running at http://localhost:${port}`);
    
});




    


