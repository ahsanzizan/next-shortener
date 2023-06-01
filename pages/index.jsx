import Header from "@/components/Header";
import clientProm from "@/lib/mongodb";
import { withSessionSsr } from "@/lib/session";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";


export default function Home({ data }) {
  const router = useRouter();
  const form = useRef();

  async function addLink(e) {
    try {
      e.preventDefault();
      const fetchData = await fetch('/api/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullUrl: e.target.fullUrl.value, shortUrl: e.target.shortUrl.value }),
      }).then(x => x.json());
  
      if (fetchData.status === 200) {
        alert('saved successfully');
        router.push('/')
      } else {
        alert(`Failed to save ${fetchData.error}`);
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  async function deleteLink(id) {
    const isYes = confirm('Delete?');
    if (!isYes) return;
    const deleteLink = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(x => x.json());

    if (deleteLink.status === 200) {
      alert(deleteLink.message);
      router.reload(window.location.pathname);
    } else alert(`Failed to delete ${deleteLink.err}`);
  }

  return (
    <main className="px-5">
      <Header title={"ahsanzizan - URL Shortener"} />
      <section className="py-10">
        <div className="max-w-3xl xl:max-w-5xl px-2 mx-auto">
          <h1 className="text-center text-secondary font-semibold text-xl md:text-3xl mb-10">
            <Link className="text-main hover:underline" href={"https://www.ahsanzizan.xyz/"} >ahsanzizan</Link> - URL Shortener
          </h1>
          <form ref={form} onSubmit={addLink} className="w-full flex flex-col gap-5 text-black">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullUrl" className="font-bold text-lg text-main">Full URL</label>
                <input type="url" placeholder="URL" className="text-gray-900 px-3 py-2 outline-2 focus:outline-main" name="fullUrl" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="shortUrl" className="font-bold text-lg text-main">Short URL</label>
                <input type="text" placeholder="Desired Short URL" className="text-gray-900 px-3 py-2 outline-2 focus:outline-main" name="shortUrl" required />
              </div>
              <input type="submit" value="Add New Link" className="w-full px-5 py-3 bg-main text-secondary font-semibold rounded cursor-pointer hover:bg-opacity-75" />
          </form>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-2 xl:max-w-5xl">
        <div className="flex h-screen flex-col justify-between">
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <Link className="text-xl text-secondary bg-red-600 text-center py-2 font-semibold hover:bg-opacity-75 block mb-5 max-w-[63.5rem] mx-auto rounded" href={"/api/logout"}>Logout</Link>
                    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="py-5">
                            <table className="min-w-full bg-[#222831]">
                                <thead className="shadow-xl border-t-2 border-l-2 border-r-2 border-main">
                                    <tr>
                                        <th scope="col" className="font-semibold text-sm text-white px-1 text-left">
                                            No.
                                        </th>
                                        <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left">
                                            Full
                                        </th>
                                        <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left">
                                            Short
                                        </th>
                                        <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left">
                                            Clicks
                                        </th>
                                        <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-secondary">
                                    {data.map((link, i) => {
                                        return <tr key={i} className="border-b transition duration-300 ease-in-out">
                                            <td className="p-2 whitespace-nowrap text-sm font-semibold text-main">{i + 1}</td>
                                            <td className="text-sm text-main font-semibold px-6 py-4 whitespace-nowrap max-w-[210px] overflow-clip">
                                                <Link className="mb-2 block hover:underline duration-300" href={`${link.fullUrl}`}>{link.fullUrl}</Link>
                                            </td>
                                            <td className="text-sm text-main font-semibold px-6 py-4 whitespace-nowrap max-w-[210px] overflow-clip">
                                                <Link className="mb-2 block hover:underline duration-300" href={`/${link.shortUrl}`}>{link.shortUrl}</Link>
                                            </td>
                                            <td className="text-sm text-main font-semibold px-6 py-4 whitespace-nowrap">
                                                {link.clicks}
                                            </td>
                                            <td className="text-sm text-main font-semibold px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => deleteLink(link._id)} className="duration-300 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req }) {
  if (!req.session?.state?.loggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const connectDB = await clientProm;
  const data = await connectDB.db('links').collection('link').find({}).toArray();
  
  return {
    props: {
      data: JSON.parse(JSON.stringify(data))
    }
  }
})