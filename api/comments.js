const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

const comentarioSchema = new mongoose.Schema({
    name: String,
    comment: String,
    rating: Number
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const comentarios = await Comentario.find();
            res.status(200).json(comentarios);
        } catch (error) {
            console.error('Error getting comments:', error);
            res.status(500).json({ error: 'Error getting comments' });
        }
    } else if (req.method === 'POST') {
        const { name, comment, rating } = req.body;
        const nuevoComentario = new Comentario({ name, comment, rating });

        try {
            await nuevoComentario.save();
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error saving comment:', error);
            res.status(500).json({ success: false, error: 'Error saving comment' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
