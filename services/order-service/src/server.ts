import { app } from "./app";
const port = Number(process.env.PORT ?? 4005);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "order-service"} listening on port ${port}`));
