import clientProm from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function deleteLink(req, res) {
    if (req.method !== 'POST') return res.status(401).json({ status: 401, err: `Method ${req.method} isn't allowed`});
    try {
        const connectDB = await clientProm;
        const id = req.body.id;
        const getLinkData = await connectDB.db('links').collection('link').findOne({ _id: new ObjectId(id) });
        if (getLinkData) {
            await connectDB.db('links').collection('link').deleteOne({ _id: new ObjectId(id) });
            return res.json({ status: 200, message: "Deleted successfully" });
        } else {
            return res.json({ status: 404, err: `Link not found` });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: 500, err: 'Internal server error' });
    }
}