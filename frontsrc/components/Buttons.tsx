import * as React from "react";
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import Button from './Button';
import globalStore from '../globalStore';
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";


const createGameMutationDoc = gql`
	mutation {
		# game id
		createGame
	}
`;
const joinGameMutationDoc = gql`
	mutation($gameId: ID!, $player: Int!) {
		# token
		joinGame(gameId: $gameId, player: $player)
	}
`;
const setBackColorMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $color: String!) {
		# game id
		setBackColor(gameId: $gameId, token: $token, color: $color)
	}
`;
const setPlayerNameMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $name: String!) {
		# true si ok
		setPlayerName(gameId: $gameId, token: $token, name: $name)
	}
`;
const shuffleMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		shuffle(gameId: $gameId, token: $token)
	}
`;
const cutMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $wherePercentage: Float!) {
		# true si ok
		cut(gameId: $gameId, token: $token, wherePercentage: $wherePercentage)
	}
`;
const dealMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $by: [Int!]!) {
		# true si ok
		deal(gameId: $gameId, token: $token, by: $by)
	}
`;
const sortHandMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $trump: String) {
		# true si ok
		sortHand(gameId: $gameId, token: $token, trump: $trump)
	}
`;
const lookLastTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		lookLastTrick(gameId: $gameId, token: $token) {
			player
			card
		}
	}
`;
export const playCardMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $card: String!) {
		# true si ok
		playCard(gameId: $gameId, token: $token, card: $card)
	}
`;
const unplayCardMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		unplayCard(gameId: $gameId, token: $token)
	}
`;
export const takeTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		takeTrick(gameId: $gameId, token: $token)
	}
`;
const untakeTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		untakeTrick(gameId: $gameId, token: $token)
	}
`;
const regroupMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $firstTeam: Int!) {
		# true si ok
		regroup(gameId: $gameId, token: $token, firstTeam: $firstTeam)
	}
`;

const colors = ['blue', 'green', 'grey', 'purple', 'red', 'yellow'];

const cardSet = [
	'7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
	'7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
	'7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
	'7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
];

const getCardName = (card: string) => (
	(({
		J: 'valet',
		Q: 'dame',
		K: 'roi',
		A: 'as',
	} as any)[card.substring(0, card.length - 1)] || card.substring(0, card.length - 1))
	+ " de " + ({
		C: "trèfle",
		D: "carreau",
		H: "coeur",
		S: "pique",
	} as any)[card.charAt(card.length - 1)]
);

const style = {
	margin: '2px',
	width: '150px',
	height: '24px',
	borderRadius: '12px',
};

export default observer(() => {
	const [createGameMutation] = useMutation(createGameMutationDoc);
	const [joinGameMutation] = useMutation(joinGameMutationDoc);
	const [setBackColorMutation] = useMutation(setBackColorMutationDoc);
	const [setPlayerNameMutation] = useMutation(setPlayerNameMutationDoc);
	const [shuffleMutation] = useMutation(shuffleMutationDoc);
	const [cutMutation] = useMutation(cutMutationDoc);
	const [dealMutation] = useMutation(dealMutationDoc);
	const [sortHandMutation] = useMutation(sortHandMutationDoc);
	const [lookLastTrickMutation] = useMutation(lookLastTrickMutationDoc);
	const [playCardMutation] = useMutation(playCardMutationDoc);
	const [unplayCardMutation] = useMutation(unplayCardMutationDoc);
	const [takeTrickMutation] = useMutation(takeTrickMutationDoc);
	const [untakeTrickMutation] = useMutation(untakeTrickMutationDoc);
	const [regroupMutation] = useMutation(regroupMutationDoc);

	const createGame = React.useCallback(async () => {
		try {
			const res = await createGameMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
			runInAction(() => {
				globalStore.gameId = res.data.createGame;
				globalStore.token = null;
			});
			// eslint-disable-next-line no-alert
			alert(
				"Vous pouvez envoyer l'id dans la zone de texte aux autres joueurs qui devront le mettre dans cette même zone de texte."
				+ " Chaque joueur doit ensuite cliquer sur Rejoindre.",
			);
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [createGameMutation]);
	const joinGame = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const playerString = prompt("Numéro du joueur à remplacer (0-3) :");
		if (playerString === null) return;
		try {
			const player = parseInt(playerString, 10);
			if (![0, 1, 2, 3].includes(player)) throw new Error("Numéro de joueur incorrect");

			const res = await joinGameMutation({ variables: {
				gameId: globalStore.gameId,
				player: player,
			} });

			runInAction(() => {
				globalStore.token = res.data.joinGame;
			});
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [joinGameMutation]);
	const setBackColor = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const colorString = prompt("Couleur du dos des cartes (" + colors.join(', ') + ") :");
		if (colorString === null) return;
		try {
			const color = colorString;
			if (!colors.includes(color)) throw new Error("Couleur incorrecte");

			await setBackColorMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				color,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [setBackColorMutation]);
	const setPlayerName = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const nameString = prompt("Nom :");
		if (nameString === null) return;
		try {
			const name = nameString;

			await setPlayerNameMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				name,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [setPlayerNameMutation]);
	const shuffle = React.useCallback(async () => {
		try {
			await shuffleMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [shuffleMutation]);
	const cut = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const wherePercentageString = prompt("A quel pourcentage du haut (0-100) ? Un aléa entre -3 et + 3 cartes sera ajouté.");
		if (wherePercentageString === null) return;
		try {
			const wherePercentage = parseFloat(wherePercentageString);
			if (isNaN(wherePercentage) || wherePercentage < 0 || wherePercentage > 100) throw new Error("Pourcentage incorrect");

			await cutMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				wherePercentage,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [cutMutation]);
	const deal = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const byString = prompt("Par combien ?", "[3, 2, 3]");
		if (byString === null) return;
		try {
			const by = JSON.parse(byString);
			if (
				!by || !Array.isArray(by) || by.length !== 3
				|| by.some((nb) => nb !== 3 && nb !== 2)
			|| by.reduce((acc, cur) => acc + cur, 0) !== 8
			) throw new Error("Répartition incorrecte");

			await dealMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				by,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [dealMutation]);
	const sortHand = React.useCallback(async () => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump: null,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);
	const sortHandH = React.useCallback(async () => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump: 'H',
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);
	const sortHandC = React.useCallback(async () => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump: 'C',
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);
	const sortHandD = React.useCallback(async () => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump: 'D',
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);
	const sortHandS = React.useCallback(async () => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump: 'S',
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);
	const lookLastTrick = React.useCallback(async () => {
		try {
			const res = await lookLastTrickMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
			// eslint-disable-next-line no-alert
			alert(
				!res.data.lookLastTrick ?
					"Pas de dernier pli"
					:
					res.data.lookLastTrick.map(
						(pc: { player: number, card: string }) =>
							getCardName(pc.card) + " jouée par " + (globalStore.players[pc.player] || "le joueur " + pc.player)
						,
					).join('\n')
				,
			);
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [lookLastTrickMutation]);
	const playCard = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const cardString = prompt("Carte (" + cardSet.join(', ') + ") :");
		if (cardString === null) return;
		try {
			const card = cardString;
			if (!cardSet.includes(card)) throw new Error("Carte incorrecte");

			await playCardMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				card,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [playCardMutation]);
	const unplayCard = React.useCallback(async () => {
		try {
			await unplayCardMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [unplayCardMutation]);
	const takeTrick = React.useCallback(async () => {
		try {
			await takeTrickMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [takeTrickMutation]);
	const untakeTrick = React.useCallback(async () => {
		try {
			await untakeTrickMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [untakeTrickMutation]);
	const regroup = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const firstTeamString = prompt("Numéro du tas de l'équipe à mettre au dessus (0 ou 1) :", "0");
		if (firstTeamString === null) return;
		try {
			const firstTeam = parseInt(firstTeamString, 10);
			if (![0, 1].includes(firstTeam)) throw new Error("Numéro d'équipe incorrect");

			await regroupMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				firstTeam,
			} });
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [regroupMutation]);

	const handleGameIdOnChange = React.useCallback(action((event: React.ChangeEvent<HTMLInputElement>) => {
		globalStore.gameId = event.target.value;
	}), []);

	return (
		<div style={{ flexDirection: 'row', display: 'flex' }}>
			<div style={{ flexDirection: 'column' }}>
				<Button text="Nouvelle partie" onClick={createGame} />
				<div style={style}>
					<input type='text' value={globalStore.gameId || ''} onChange={handleGameIdOnChange} />
				</div>
				<Button text="Rejoindre" onClick={joinGame} />
				<Button text="Changer la couleur" onClick={setBackColor} />
				<Button text="Changer de nom" onClick={setPlayerName} />
				<br />
				<br />
				<Button text="Mélanger" onClick={shuffle} />
				<Button text="Couper" onClick={cut} />
				<Button text="Distribuer" onClick={deal} />
				<Button text="Reformer le jeu" onClick={regroup} />
				<br />
				<div>Trier mes cartes :</div>
				<Button text="Sans atout" onClick={sortHand} />
				<div>
					<Button text="Coeur" onClick={sortHandH} small={true} />
					<Button text="Trèfle" onClick={sortHandC} small={true} />
				</div>
				<div>
					<Button text="Carreau" onClick={sortHandD} small={true} />
					<Button text="Pique" onClick={sortHandS} small={true} />
				</div>
				<br />
				<br />
				<Button text="Dernier pli" onClick={lookLastTrick} />
				<Button text="Poser une carte" onClick={playCard} />
				<Button text="Reprendre ma carte" onClick={unplayCard} />
				<Button text="Prendre le pli" onClick={takeTrick} />
				<Button text="Reposer le pli" onClick={untakeTrick} />
			</div>
		</div>
	);
});
