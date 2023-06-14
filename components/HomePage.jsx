'use client'
import Link from "next/link";
import { useRef } from "react";

export default function HomePage({ links }) {
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
            window.location.href = '/';
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
          window.location.href = '/';
        } else alert(`Failed to delete ${deleteLink.err}`);
      }
    
      return (
        <main className="px-5">
          <section className="">
            <div className="max-w-3xl xl:max-w-5xl px-2 mx-auto">
              <div className="mx-auto max-w-3xl px-2 xl:max-w-5xl">
                <div className="flex h-screen flex-col justify-between">
                  <div className="m-auto">
                    <h1 className="heading-text text-5xl mb-20">
                      <Link className="hover:underline" href={"https://www.ahsanzizan.xyz/"} >ahsanzizan</Link> - URL Shortener
                    </h1>
                    <form ref={form} onSubmit={addLink} className="group w-full drop-shadow-lg rounded px-8 pt-6 pb-8 mb-4 duration-100 border-1">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="fullUrl" className="block uppercase tracking-wide text-xs font-extrabold mb-2">Full URL</label>
                          <input type="url" placeholder="URL" className="tracking-widest appearance-none block w-full font-bold bg-transparent text-black border-2 border-transparent border-b-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-black" name="fullUrl" required />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="shortUrl" className="block uppercase tracking-wide text-xs font-extrabold mb-2">Short URL</label>
                          <input type="text" placeholder="Desired Short URL" className="tracking-widest appearance-none block w-full font-bold bg-transparent text-black border-2 border-transparent border-b-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-black" name="shortUrl" required />
                        </div>
                        <button type="submit" className="uppercase font-extrabold w-full h-14 bg-black border-2 border-black hover:bg-transparent text-white hover:text-black transition duration-300">Add New</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="mx-auto max-w-3xl px-2 xl:max-w-5xl pb-32">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="py-5">
                                    <table className="min-w-full bg-black text-white">
                                        <thead className="shadow-xl border-t-2 border-l-2 border-r-2 border-main">
                                            <tr>
                                              <th scope="col" className="font-semibold text-sm px-1 text-left">
                                                  No.
                                              </th>
                                              <th scope="col" className="font-semibold text-sm px-1 text-left">
                                                  Full
                                              </th>
                                              <th scope="col" className="font-semibold text-sm px-1 text-left">
                                                  Short
                                              </th>
                                              <th scope="col" className="font-semibold text-sm px-1 text-left">
                                                  Clicks
                                              </th>
                                              <th scope="col" className="font-semibold text-sm px-1 text-left">
                                                  Action
                                              </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {links.map((link, i) => {
                                                return <tr key={i} className="border-b transition duration-300 ease-in-out">
                                                    <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap max-w-[210px] overflow-clip">
                                                      <Link className="mb-2 block hover:underline duration-300" href={`${link.fullUrl}`}>{link.fullUrl}</Link>
                                                    </td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap max-w-[240px] overflow-clip">
                                                      <Link className="mb-2 block hover:underline duration-300" href={`/${link.shortUrl}`}>{link.shortUrl}</Link>
                                                    </td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                        {link.clicks}
                                                    </td>
                                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                        <button onClick={() => deleteLink(link._id)} className="px-3 mx-3 uppercase font-extrabold bg-black border-2 border-black hover:bg-transparent text-center py-3 mb-5 text-white hover:text-black transition duration-300" type="button">
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