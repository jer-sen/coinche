export default `
	type CardPlayed {
		player: Int!
		card: String!
	}

	type Game {
		id: ID!
		player: Int!
		players: [String]!
		hand: [String!]
		currentTrick: [CardPlayed!]
		winnedCards: [[String!]!]
		actions: [String!]!
		backColor: String!
	}

	type Query {
		game(id: ID!, token: String!): Game!
	}

	type Mutation {
		# game id
		createGame: ID!
		# token
		joinGame(gameId: ID!, player: Int!): String!
		# game id
		setBackColor(gameId: ID!, token: String!, color: String!): Boolean!
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
		regroup(gameId: ID!, token: String!, firstTeam: Int!): Boolean!
	}
`;
