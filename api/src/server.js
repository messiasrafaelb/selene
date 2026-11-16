import { app } from "./app.js";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API do Projeto Selene no ar em http://localhost:${PORT}`);
});
