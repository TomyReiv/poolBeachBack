import app from './app'
import { port } from './utils/constant'


app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Node.js con TypeScript!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
