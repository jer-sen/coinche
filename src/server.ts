// eslint-disable-next-line import/default
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import schema from './schema';
import resolvers, { initializeCollection } from './resolvers';
import 'moment/locale/fr';
// eslint-disable-next-line import/default
import moment from 'moment-timezone';

moment.tz.setDefault("Europe/Paris");
moment.locale('fr');


(async () => {
	await initializeCollection();

	const server = new ApolloServer({
		typeDefs: gql(schema),
		resolvers,
		playground: true,
		debug: true,
	});
	const graphqlPath = '/graphql';


	// eslint-disable-next-line no-process-env
	const PORT = process.env.PORT || 3000;
	const app = express();

	server.applyMiddleware({
		app: app,
		path: graphqlPath,
	});
	// eslint-disable-next-line import/no-named-as-default-member
	app.use('/', express.static('frontdist'));
	// eslint-disable-next-line no-console
	app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
})();
