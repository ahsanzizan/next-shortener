import clientProm from "@/lib/mongodb";

export default function TempPage() {
    return (
        <>
            
        </>
    )
}

export async function getServerSideProps({ params }) {
    var { link } = params;
    const connectDB = await clientProm;
    const findLink = await connectDB.db('links').collection('link').findOne({ shortUrl: link });
    if (findLink) {
        return {
            redirect: {
                destination: findLink.fullUrl,
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}