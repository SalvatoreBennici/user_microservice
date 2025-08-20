import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'My User API',
			version: '1.0.0',
			description: 'API per la gestione e registrazione degli utenti',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Server di Sviluppo',
			},
		],
	},
	apis: ['./src/interfaces/restful/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
