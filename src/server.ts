import express from 'express';
import { ObjectID, MongoClient } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server-express';
import { join } from 'path';

/*
créer partie
rejoindre partie

changer nom

mélanger

couper
distribuer

mettre devant
regarder 4 dernières
jouer carte
reprendre carte
prendre le pli
annuler prise
regarder tout
rassembler

dernières actions


affichage :
- names
- hand
- current
- lastWinned
- winned avec points (sans atouts)
- lastActions

[7-8JQKA][CDHS]
C = pique
D = carreau
H = coeur
S = pique



{
	lastActions: ["Jérôme à pris le pli"],
	hands: [
		[{ color: 'heart', value: 'ace' }],
		[{ color: 'tile', value: '7' }],
		[{ color: 'clover', value: 'king' }],
		[{ color: 'pike', value: '8' }],
	],
	winned: [
		[{ color: 'heart', value: 'queen' }],
		[{ color: 'heart', value: 'jack' }],
	],
	current: [{ player: 0, color: 'heart', value: '8' }],
	lastWinned: [{ color: 'heart', value: '8' }],
	toDeal: [{ }]
}
*/


const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];


const resolvers = {
  Query: {
    books: () => books,
  },
};


(async () => {
	const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://heroku_36d4mbhj:qskglj6r4o81stnudp32vj2rp2@ds343718.mlab.com:43718/heroku_36d4mbhj';
	const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	const dbName = MONGODB_URI.match(/^.*\/([a-zA-Z0-9_]+$)/u)[1];
	const db = client.db(dbName);
	
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		playground: true,
		debug: true,
	});
	const graphqlPath = '/graphql';


	const PORT = process.env.PORT || 3000;
	const app = express();

	app.use('/', express.static(join(__dirname, '../frontdist')));
	server.applyMiddleware({
		app: app,
		path: graphqlPath,
	});
	app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
})();

