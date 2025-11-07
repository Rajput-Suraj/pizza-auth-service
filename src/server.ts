import app from "./app.ts";
import logger from "./config/logger.ts";
import { Config } from "./config/index.ts";

const startServer = () => {
  const PORT = Config.PORT;
  try {
    app.listen(PORT, () =>
      logger.log("info", `Server is listening on port ${PORT}`),
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
};

startServer();
