import { app } from "./app";
const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "api-gateway"} listening on port ${port}`));
