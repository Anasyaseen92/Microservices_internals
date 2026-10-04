import { app } from "./app";
const port = Number(process.env.PORT ?? 4001);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "auth-service"} listening on port ${port}`));
