export default `
	type Game {
		id: ID!
		players: [String]!
		handsCardsNumber: [Int!]
		hand: [String!]
		winnedCards: [[String!]!]
		lastActions: [String!]!
		backColor: String!
	}

	type CardPlayed {
		player: Int!
		card: String!
	} 

	type Query {
		game(gameId: ID!, token: String!): Game!
	}

	type Mutation {
		# game id
		createGame: ID!
		# game id
		setBackColor(gameId: ID!, player: Int!, color: String!): Boolean!
		# token
		joinGame(gameId: ID!, player: Int!): String!
		# true si ok
		setPlayerName(gameId: ID!, token: String!, name: String!): Boolean!
		# true si ok
		shuffle(gameId: ID!, token: String!): Boolean!
		# true si ok
		cut(gameId: ID!, token: String!, wherePercentage: Float!): Boolean!
		# true si ok
		deal(gameId: ID!, token: String!, by: [Int!]!): Boolean!
		# true si ok
		sortHand(gameId: ID!, token: String!, trump: String): Boolean!
		# true si ok
		lookLastTrick(gameId: ID!, token: String!): [CardPlayed!]
		# true si ok
		playCard(gameId: ID!, token: String!, card: String!): Boolean!
		# true si ok
		unplayCard(gameId: ID!, token: String!): Boolean!
		# true si ok
		takeTrick(gameId: ID!, token: String!): Boolean!
		# true si ok
		untakeTrick(gameId: ID!, token: String!): Boolean!
		# true si ok
		regroup(gameId: ID!, token: String!, firstTeam: Int): Boolean!
	}
`;
