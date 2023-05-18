import clientProm from "@/lib/mongodb";
import Link from "next/link";
import { useRouter } from "next/router";


export default function Home({ data }) {
  const router = useRouter();

  async function saveChanges(e) {
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
    <>
      <div className="w-full max-w-xs mx-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={saveChanges}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
              Full URL
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="url" name="fullUrl" placeholder="Enter the Full URL" autoComplete="off" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
              Short URL
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" name="shortUrl" placeholder="Enter the Short URL You Want" required />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add Link
            </button>
          </div>
        </form>
      </div>
      <div className="mx-auto max-w-3xl px-2 xl:max-w-5xl">
                <div className="flex h-screen flex-col justify-between">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="py-5">
                                    <table className="min-w-full bg-[#222831]">
                                        <thead className="shadow-xl border-t-2 border-l-2 border-r-2 border-main">
                                            <tr>
                                                <th scope="col" className="font-semibold text-sm text-white px-1 text-left">
                                                    No.
                                                </th>
                                                <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left max-w-[200px]">
                                                    Full URL
                                                </th>
                                                <th scope="col" className="font-semibold text-sm text-white px-5 py-4 text-left">
                                                    Short URL
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
                                                    <td className="p-2 whitespace-nowrap text-sm font-medium text-white">{i + 1}</td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap max-w-[210px] overflow-clip">
                                                        <span className="mb-2 block duration-300">{link.fullUrl}</span>
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap max-w-[210px] overflow-clip">
                                                        <span className="mb-2 block duration-300">{link.shortUrl}</span>
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
                                                        {link.clicks}
                                                    </td>
                                                    <td className="text-sm text-white font-light px-6 py-4 whitespace-nowrap">
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
    </>
  )
}

export async function getServerSideProps() {
  const connectDB = await clientProm;
  const data = await connectDB.db('links').collection('link').find({}).toArray();
  
  return {
    props: {
      data: JSON.parse(JSON.stringify(data))
    }
  }
}