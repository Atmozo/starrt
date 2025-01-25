import { app, HttpRequest, InvocationContext } from "@azure/functions";

export async function httpTrigger(req: HttpRequest, context: InvocationContext): Promise<void> {
    const name = req.query.get("name") || (await req.json()).name || "world";
    context.log(`HTTP trigger function processed a request. Name: ${name}`);
    context.res = {
        status: 200,
        body: `Hello, ${name}!`,
    };
}

app.http("HttpTrigger", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: httpTrigger,
});
