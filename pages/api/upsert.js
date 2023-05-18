import clientProm from "@/lib/mongodb";

export default async function uploadHandler(req, res) {
    if (req.method !== 'POST') return res.status(401).json({ status: 401, err: `Method ${req.method} isn't allowed`});
    try {
        const connectDB = await clientProm;
        const isNew = !req.body.fullUrl;
        delete req.body._id;
        const insert = await connectDB.db('links').collection('link').updateOne({ fullUrl: req.body.fullUrl },
            { $set: !isNew ? { shortUrl: req.body.shortUrl } : { ...req.body, clicks: 0 } },
            { upsert: true });
        return res.send({ status: 200, mongo: insert, isNew: isNew });
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 500, err: 'Internal server error' });
    }
}

export const config =  {
    api: {
        bodyParser: {
            sizeLimit: '3mb',
        }
    }
}