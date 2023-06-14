import clientProm from "@/lib/mongodb";
import { redirect } from "next/navigation";

export default async function ViewLink({ params }) {
    const link = params.link;
    const connectDB = await clientProm;
    const getLink = await connectDB.db('links').collection('link').findOne({ shortUrl: link });

    if (getLink) {
        connectDB.db('links').collection('link').updateOne({ _id: getLink._id }, { $inc: { clicks: 1 } });
        return redirect(getLink.fullUrl);
    }

    return (
        <>
            <main className="text-center flex flex-col gap-4 justify-center items-center w-screen h-screen">
                <h1 className="heading-text text-9xl">404</h1>
                <p className="heading-text text-2xl">The Page {"You're"} Looking For is Not Found</p>
            </main>
        </>
    )
}