import { Price } from "@/types";

export const getUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";

  // Tambahin protokol kalau belum ada
  url = url.includes("http") ? url : `http://${url}`;

  // Pastikan URL diakhiri dengan slash
  url = url.endsWith("/") ? url : `${url}/`;

  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data: { price: Price };
}) => {
  console.log("POST REQUEST:", url, data);

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.statusText}`);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  const t = new Date(0);
  t.setUTCSeconds(secs);
  return t;
};
