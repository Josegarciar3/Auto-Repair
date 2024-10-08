import twilio from 'twilio';
// import dotenv from 'dotenv';

// Cargar las variables de entorno
// dotenv.config();

const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTH_TOKEN_TWILIO;
console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken ? 'Exists' : 'Not Found');
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
    console.log('Request received')
    if (req.method !== 'POST') {
        console.log('Invalid Method')
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { name, email, phone, date, time } = req.body;
    console.log('Request body', req.body);

    const messageBody = `Hola ${name}, tu cita está confirmada para el ${date} a las ${time}. Gracias por elegir Reyes Auto Repair.`;

    const numerosDestinatarios = [`+1${phone}`, '+16692162165', '+14084606104'];

    try {
        const messages = await Promise.all(
            numerosDestinatarios.map(numero => client.messages.create({
                body: messageBody,
                from: '+18445611302',
                to: numero,
            }))
        );

        messages.forEach(message => console.log(message.sid));
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
}