import app from "./app.ts";
import { Config } from "./config/index.ts";

const startServer = () => {
  const PORT = Config.PORT;
  try {
    // eslint-disable-next-line no-console
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
};

startServer();
