import { app } from "./app";
const port = Number(process.env.PORT ?? 4004);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "cart-service"} listening on port ${port}`));
