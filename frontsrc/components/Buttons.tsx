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
const lookLastTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		lookLastTrick(gameId: $gameId, token: $token) {
			player
			card
		}
	}
`;
const unplayCardMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		unplayCard(gameId: $gameId, token: $token)
	}
`;

const untakeTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		untakeTrick(gameId: $gameId, token: $token)
	}
`;
export const regroupMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $order: [Int!]!) {
		# true si ok
		regroup(gameId: $gameId, token: $token, order: $order)
	}
`;

const colors = ['blue', 'green', 'grey', 'purple', 'red', 'yellow'];

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
	const [lookLastTrickMutation] = useMutation(lookLastTrickMutationDoc);
	const [unplayCardMutation] = useMutation(unplayCardMutationDoc);
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
			if (globalStore.refetch) await globalStore.refetch();
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
			if (globalStore.refetch) await globalStore.refetch();
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
			if (globalStore.refetch) await globalStore.refetch();
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
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [setPlayerNameMutation]);
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
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [lookLastTrickMutation]);
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
	const untakeTrick = React.useCallback(async () => {
		try {
			await untakeTrickMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [untakeTrickMutation]);
	const regroup = React.useCallback(async () => {
		// eslint-disable-next-line no-alert
		const orderString = prompt("Ordre des tas (cartes gagnées, mains, pli en cours) du dessus au dessous :", "[0, 1]");
		if (orderString === null) return;
		try {
			const order = JSON.parse(orderString);
			if (!Array.isArray(order) || ![...order].sort().every((o, i) => o === i)) throw new Error("Ordre incorrect");

			await regroupMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				order,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [regroupMutation]);

	const handleReverseSortChange = React.useCallback(action((event: React.ChangeEvent<HTMLInputElement>) => {
		globalStore.reverseSort = event.target.checked;
	}), [globalStore]);

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
				<div>
					<label>
						{"Tri inversé : "}
						<input
							type="checkbox"
							checked={globalStore.reverseSort}
							onChange={handleReverseSortChange}
						/>
					</label>
				</div>
				<br />
				<Button text="Reformer le jeu" onClick={regroup} />
				<br />
				<br />
				<Button text="Dernier pli" onClick={lookLastTrick} />
				<Button text="Reprendre ma carte" onClick={unplayCard} />
				<Button text="Reposer le pli" onClick={untakeTrick} />
			</div>
		</div>
	);
});
