import { getRequestCookie } from "@/lib/getRequestCookie";
import clientProm from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import HomePage from "@/components/HomePage";


export default async function Home() {
  
  const admin = await getRequestCookie(cookies());
  if (!admin) {
    return redirect('/login');
  }

  const connectDB = await clientProm;
  const links = JSON.parse(JSON.stringify(await connectDB.db('links').collection('link').find({ }).toArray()));

  return (
    <>
        <HomePage links={links} />
    </>
  )
}