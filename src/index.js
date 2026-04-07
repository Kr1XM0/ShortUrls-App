import app from "./app.js";
import { PORT } from "./config/app.js";

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on PORT: http://localhost:${PORT}`);
});
