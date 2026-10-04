import { app } from "./app";
const port = Number(process.env.PORT ?? 4006);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "payment-service"} listening on port ${port}`));
