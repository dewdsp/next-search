import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

export interface Notice {
  forename: string;
  date_of_birth: string;
  entity_id: string;
  nationalities: string[];
  name: string;
  _links: Links;
}

export interface Links {
  self: Images;
  images: Images;
  thumbnail: Images;
}

export interface Images {
  href: string;
}

const Home: NextPage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // search the api
    async function fetchData() {
      setLoading(true);

      setNotices([]);

      const data = await fetch(
        `https://ws-public.interpol.int/notices/v1/red?forename=${debouncedSearch}&resultPerPage=200`
      ).then((res) => res.json());
      setNotices(data._embedded.notices);
      setLoading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col items-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <input
          className="mt-3 text-2xl outline-double"
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Loading...</p>}

        {notices.map((notice) => {
          return (
            <div key={notice.entity_id} className="text-xl">
              {notice._links.thumbnail?.href && (
                <Image
                  src={notice._links.thumbnail.href}
                  width="100px"
                  height="100px"
                  alt={notice.name}
                />
              )}
              <div className="flex mr-3">
                <p>
                  Name: {notice.forename} {notice.name}
                </p>
                <p className="text-blue-300 px-3">
                  Birth: {notice.date_of_birth}
                </p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Home;
