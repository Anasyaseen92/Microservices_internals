import { app } from "./app";
const port = Number(process.env.PORT ?? 4003);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "inventory-service"} listening on port ${port}`));
