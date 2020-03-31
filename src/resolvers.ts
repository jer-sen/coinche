// eslint-disable-next-line no-unused-vars
import { ObjectID, MongoClient, Collection } from 'mongodb';
// eslint-disable-next-line import/default
import moment from 'moment-timezone';

let col: Collection<any> | null = null;
export const initializeCollection = async () => {
	// eslint-disable-next-line no-process-env
	const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_36d4mbhj:qskglj6r4o81stnudp32vj2rp2@ds343718.mlab.com:43718/heroku_36d4mbhj';
	const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	const dbName = MONGODB_URI.match(/^.*\/([a-zA-Z0-9_]+$)/u)[1];
	col = client.db(dbName).collection('games');
};

const getTimePostfix = () => moment().format('[ le ]DD/MM/YYYY[ à ]HH:mm:ss');

/*
	[7-10JQKA][CDHS]
	C = trefle
	D = carreau
	H = coeur
	S = pique
*/
const cardSet = [
	'7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
	'7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
	'7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
	'7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
];

const suits = ['C', 'D', 'H', 'S'];
const sortedCardNumbersNotTrump = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
const sortedCardNumbersTrump = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'];

const colors = ['blue', 'green', 'grey', 'purple', 'red', 'yellow'];

interface GameData {
	_id: ObjectID
	players: { name: string | null, token: string | null }[]
	hands: string[][] | null
	winnedCards: string[][] | null
	currentTrick: { player: number, card: string }[] | null
	lastTrick: { player: number, card: string }[] | null
	toDeal: string[] | null
	lastActions: string[]
	backColor: string
}

const shuffle = (array: string[]) => {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		const temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};

const makeid = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export default {
	Query: {
		game: async (_: any, args: { id: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.id) }) as GameData | null;
			if (!gameData) throw new Error("Wrong id");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong player");

			return {
				id: gameData._id.toHexString(),
				players: gameData.players.map(({ name }) => name),
				handsCardsNumber: gameData.hands && gameData.hands.map((h) => h.length),
				hand: gameData.hands && gameData.hands[player],
				winnedCards: gameData.winnedCards,
				lastActions: gameData.lastActions,
				backColor: gameData.backColor,
			};
		},
	},

	Mutation: {
		createGame: async () => {
			const res = await col.insertOne({
				players: [null, null, null, null],
				hands: [[], [], [], []],
				winnedCards: [[], []],
				currentTrick: [],
				lastTrick: null,
				toDeal: [...cardSet],
				lastActions: ["Partie créée" + getTimePostfix()],
				backColor: 'blue',
			});
			return res.insertedId;
		},
		joinGame: async (_: any, args: { gameId: string, player: number }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			if (![0, 1, 2, 3].includes(args.player)) throw new Error("Wrong player");
			const token = makeid(10);
			const players = gameData.players;
			players[args.player].token = token;
			await col.updateOne({ _id: gameData._id }, { $set: { players: players } });
			return token;
		},
		setBackColor: async (_: any, args: { gameId: string, token: string, color: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!colors.includes(args.color)) throw new Error("Wrong color");

			await col.updateOne({ _id: gameData._id }, { $set: { backColor: args.color } });
			return true;
		},
		setPlayerName: async (_: any, args: { gameId: string, token: string, name: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");

			const players = gameData.players;
			players[player].name = args.name;
			await col.updateOne({ _id: gameData._id }, { $set: { players: players } });
			return true;
		},
		shuffle: async (_: any, args: { gameId: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.toDeal || gameData.toDeal.length !== 32) throw new Error("Wrong game state");

			await col.updateOne({ _id: gameData._id }, { $set: { toDeal: shuffle(gameData.toDeal) } });
			return true;
		},
		cut: async (_: any, args: { gameId: string, token: string, wherePercentage: number }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.toDeal || gameData.toDeal.length !== 32) throw new Error("Wrong game state");
			if (args.wherePercentage < 0 || args.wherePercentage > 100) throw new Error("Wrong given position");

			const pivot = Math.floor(Math.random() * 10) - 5 + Math.floor(args.wherePercentage / 100 * 33);
			if (pivot < 3 || pivot > 29) throw new Error("Wrong calculated position");
			await col.updateOne({ _id: gameData._id }, { $set: { toDeal: [...gameData.toDeal.slice(pivot), ...gameData.toDeal.slice(0, pivot)] } });
			return true;
		},
		deal: async (_: any, args: { gameId: string, token: string, by: number[] }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.toDeal || gameData.toDeal.length !== 32) throw new Error("Wrong game state");
			if (
				args.by.length !== 3
				|| args.by.some((nb) => nb !== 3 && nb !== 2)
				|| args.by.reduce((acc, cur) => acc + cur, 0) !== 8
			) throw new Error("Wrong split");
			
			const hands: string[][] = [[], [], [], []];
			args.by.forEach((nb: number) => {
				hands.forEach((h) => {
					h.push(...gameData.toDeal.splice(0, nb));
				});
			});
			await col.updateOne({ _id: gameData._id }, { $set: { toDeal: null, hands } });
			return true;
		},
		sortHand: async (_: any, args: { gameId: string, token: string, trump: string | null }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.hands) throw new Error("Wrong game state");
			
			gameData.hands[player].sort((a, b) => {
				const aSuit = a.charAt(a.length - 1);
				const bSuit = b.charAt(b.length - 1);
				const aValue = a.substring(0, -1);
				const bValue = b.substring(0, -1);
				if (aSuit !== bSuit) return suits.indexOf(aSuit) - suits.indexOf(bSuit);
				if (aSuit === args.trump) return sortedCardNumbersTrump.indexOf(aValue) - sortedCardNumbersTrump.indexOf(bValue);
				return sortedCardNumbersNotTrump.indexOf(aValue) - sortedCardNumbersNotTrump.indexOf(bValue);
			});
			await col.updateOne({ _id: gameData._id }, { $set: { hands: gameData.hands } });
			return true;
		},
		lookLastTrick: async (_: any, args: { gameId: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			
			await col.updateOne({ _id: gameData._id }, { });
			return gameData.lastTrick;
		},
		playCard: async (_: any, args: { gameId: string, token: string, card: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.currentTrick || gameData.currentTrick.some((cp) => cp.player === player)) throw new Error("Wrong game state");
			const cardIndex = gameData.hands[player].indexOf(args.card);
			if (cardIndex < 0) throw new Error("Wrong card");
			
			gameData.currentTrick.push({ player, card: args.card });
			gameData.hands[player].splice(cardIndex, 1);
			await col.updateOne({ _id: gameData._id }, { $set: { currentTrick: gameData.currentTrick, hands: gameData.hands } });
			return true;
		},
		unplayCard: async (_: any, args: { gameId: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.currentTrick) throw new Error("Wrong game state");
			const cardIndex = gameData.currentTrick.findIndex((cp) => cp.player === player);
			if (cardIndex < 0) throw new Error("No card played");
			
			gameData.hands[player].push(gameData.currentTrick.splice(cardIndex, 1)[0].card);
			await col.updateOne({ _id: gameData._id }, { $set: { currentTrick: gameData.currentTrick, hands: gameData.hands } });
			return true;
		},
		takeTrick: async (_: any, args: { gameId: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.currentTrick || gameData.currentTrick.length !== 4) throw new Error("Wrong game state");

			gameData.winnedCards[player % 2].push(...gameData.currentTrick.map((pc) => pc.card));
			if (gameData.hands.every((h) => h.length === 0)) {
				// Partie finie
				await col.updateOne({ _id: gameData._id }, { $set: {
					hands: null,
					winnedCards: gameData.winnedCards,
					currentTrick: null,
					lastTrick: null,
					toDeal: null,
				} });
			}
			else {
				// Partie pas finie
				await col.updateOne({ _id: gameData._id }, { $set: {
					winnedCards: gameData.winnedCards,
					currentTrick: [],
					lastTrick: gameData.currentTrick,
				} });
			}
			return true;
		},
		untakeTrick: async (_: any, args: { gameId: string, token: string }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.currentTrick || gameData.currentTrick.length !== 0 || !gameData.lastTrick) throw new Error("Wrong game state");

			await col.updateOne({ _id: gameData._id }, { $set: {
				winnedCards: gameData.winnedCards.slice(0, -4),
				currentTrick: gameData.lastTrick,
				lastTrick: null,
			} });
			return true;
		},
		regroup: async (_: any, args: { gameId: string, token: string, firstTeam: number }) => {
			const gameData = await col.findOne({ _id: new ObjectID(args.gameId) }) as GameData | null;
			if (!gameData) throw new Error("Wrong gameId");
			const player = gameData.players.findIndex(({ token }) => token === args.token);
			if (player < 0) throw new Error("Wrong token");
			if (!gameData.winnedCards || gameData.winnedCards[0].length + gameData.winnedCards[1].length !== 32) throw new Error("Wrong game state");
			if (![0, 1].includes(args.firstTeam)) throw new Error("Wrong team");

			await col.updateOne({ _id: gameData._id }, { $set: {
				winnedCards: null,
				toDeal: [...gameData.winnedCards[args.firstTeam], ...gameData.winnedCards[(args.firstTeam + 1) % 2]],
			} });
			return true;
		},
	},
};
