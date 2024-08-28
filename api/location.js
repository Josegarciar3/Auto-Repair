export default function handler(req, res) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey) {
        res.status(200).json({ apiKey });
    } else {
        res.status(500).json({ error: 'API key not found' });
    }
}