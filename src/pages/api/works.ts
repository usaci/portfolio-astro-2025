import type { APIRoute } from "astro";
import { client } from "../../lib/contents";

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const isPrivate = import.meta.env.IS_PUBLIC === "true" ? "true" : "false";
  console.log(searchParams);
  
  console.log("category: " + category, "isPrivate: " + isPrivate);
  if (!import.meta.env.MICROCMS_SERVICE_DOMAIN || !import.meta.env.MICROCMS_API_KEY) {
    console.warn("環境変数が設定されていません。ダミーデータを返します。");
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = await client.getList({
      endpoint: "blogs",
      queries: {
        filters: category
          ? `category[equals]${category}[and]isPublic[equals]${isPrivate}`
          : isPrivate === "true"
            ? "isPublic[equals]true"
            : "",
      },
    });
    
    return new Response(JSON.stringify(response.contents), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API エラー:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching repo data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};