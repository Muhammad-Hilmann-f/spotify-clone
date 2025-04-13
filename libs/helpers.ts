export const getUrl = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Menambahkan protokol jika belum ada
  url = url.startsWith("http") ? url : `http://${url}`;

  return url.endsWith("/") ? url : `${url}/`;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: object;
}) => {
  console.log("POST REQUEST:", url, data);

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};
