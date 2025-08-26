import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from './interfaces/routes';

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(
	'./src/interfaces/restful/openapi.yaml',
) as Record<string, unknown>;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

const port = 3000;
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`);
	console.log(`API docs on http://localhost:${port}/api-docs`);
});
