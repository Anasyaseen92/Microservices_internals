import { app } from "./app";
const port = Number(process.env.PORT ?? 4007);
app.listen(port, () => console.log(`${process.env.SERVICE_NAME ?? "notification-service"} listening on port ${port}`));
