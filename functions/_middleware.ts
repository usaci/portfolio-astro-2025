// functions/_middleware.ts
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: {
    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;
  };
}): Promise<Response> {
  console.log(context.env.BASIC_AUTH_USERNAME, context.env.BASIC_AUTH_PASSWORD);
  return new Response("Hello World!");
}