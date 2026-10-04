import { app } from "./app";
const port = Number(process.env.PORT ?? 4002);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "product-service"} listening on port ${port}`));
