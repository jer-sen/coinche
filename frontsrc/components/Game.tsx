import * as React from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { observer } from "mobx-react";

import globalStore from "../globalStore";
import Card from "./Card";
import { action } from "mobx";
import Button from "./Button";
import { regroupMutationDoc } from "./Buttons";


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
	mutation($gameId: ID!, $token: String!, $by: [Int!]!, $firstPlayer: Int!) {
		# true si ok
		deal(gameId: $gameId, token: $token, by: $by, firstPlayer: $firstPlayer)
	}
`;
const playCardMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $card: String!) {
		# true si ok
		playCard(gameId: $gameId, token: $token, card: $card)
	}
`;

const takeTrickMutationDoc = gql`
	mutation($gameId: ID!, $token: String!) {
		# true si ok
		takeTrick(gameId: $gameId, token: $token)
	}
`;


const sortHandMutationDoc = gql`
	mutation($gameId: ID!, $token: String!, $trump: String, $reverse: Boolean) {
		# true si ok
		sortHand(gameId: $gameId, token: $token, trump: $trump, reverse: $reverse)
	}
`;

const dataQuery = gql`
	query($id: ID!, $token: String!) {
		game(id: $id, token: $token) {
			id
			player
			players
			hand
			currentTrick {
				player
				card
			}
			winnedCards
			actions {
				text
				ticks
			}
			backColor
			lastFirstPlayer
		}
	}
`;

const cardSet = [
	'7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
	'7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
	'7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
	'7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS',
];

const getLeft = (relativeIndex: number) => {
	if (relativeIndex % 2 === 0) return 0;
	return relativeIndex - 2;
};

const getTop = (relativeIndex: number) => {
	if (relativeIndex % 2 === 0) return 1 - relativeIndex;
	return 0;
};

(window as unknown as { pollInterval: number }).pollInterval = 1000;

export default observer(() => {
	const skip = !globalStore.gameId || !globalStore.token;
	const { loading, error, refetch, data } = useQuery(dataQuery, {
		variables: { id: globalStore.gameId, token: globalStore.token },
		skip,
		pollInterval: skip ? undefined : (window as unknown as { pollInterval: number }).pollInterval,
	});

	const [{ valet, neuf, belote, der }, setCountOptions] = React.useState({ valet: null, neuf: null, belote: null, der: null });

	React.useEffect(() => {
		if (data && data.game && !data.game.winnedCards) setCountOptions((prevState) => {
			if (prevState.valet === null && prevState.neuf === null && prevState.belote === null && prevState.der === null) return prevState;
			return { valet: null, neuf: null, belote: null, der: null };
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setCountOptions, data && data.game && !data.game.winnedCards]);

	const [regroupMutation] = useMutation(regroupMutationDoc);
	const [shuffleMutation] = useMutation(shuffleMutationDoc);
	const [cutMutation] = useMutation(cutMutationDoc);
	const [dealMutation] = useMutation(dealMutationDoc);
	const [playCardMutation] = useMutation(playCardMutationDoc);
	const [takeTrickMutation] = useMutation(takeTrickMutationDoc);
	const [sortHandMutation] = useMutation(sortHandMutationDoc);

	
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
	const shuffle = React.useCallback(async () => {
		try {
			await shuffleMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [shuffleMutation]);
	const cut = React.useCallback(async (cardIndex: number) => {
		try {
			await cutMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				wherePercentage: (cardIndex / 31) * 100,
			} });
			if (globalStore.refetch) await globalStore.refetch();
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
		// eslint-disable-next-line no-alert
		const firstPlayerString = prompt("En commençant par le joueur numéro ?", globalStore.player === null ? '' : String((globalStore.player + 1) % 4));
		if (firstPlayerString === null) return;
		try {
			const by = JSON.parse(byString);
			if (
				!by || !Array.isArray(by) || by.length !== 3
				|| by.some((nb) => nb !== 3 && nb !== 2)
			|| by.reduce((acc, cur) => acc + cur, 0) !== 8
			) throw new Error("Répartition incorrecte");

			const firstPlayer = parseInt(firstPlayerString, 10);
			if (![0, 1, 2, 3].includes(firstPlayer)) throw new Error("Numéro de joueur incorrect");

			await dealMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				by,
				firstPlayer,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [dealMutation]);
	const playCard = React.useCallback(async (card) => {
		try {
			await playCardMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				card,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [playCardMutation]);
	const takeTrick = React.useCallback(async () => {
		try {
			await takeTrickMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [takeTrickMutation]);
	const sortHand = React.useCallback(async (trump: string | null) => {
		try {
			await sortHandMutation({ variables: {
				gameId: globalStore.gameId,
				token: globalStore.token,
				trump,
				reverse: globalStore.reverseSort,
			} });
			if (globalStore.refetch) await globalStore.refetch();
		}
		catch (err) {
			// eslint-disable-next-line no-alert
			alert("Erreur : " + err);
		}
	}, [sortHandMutation]);

	const countOptions = [0, 1].map((t) => {
		const res: any = {};
		['valet', 'neuf', 'belote', 'der'].forEach((o) => {
			res[o] = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
				const value = event.target.checked ? t : null;
				setCountOptions((prevState) => ({ ...prevState, [o]: value }));
			}, [o]);
		});
		return res;
	});

	React.useEffect(action(() => {
		if (!data) return;
		globalStore.actions = data.game.actions;
		globalStore.players = data.game.players;
		globalStore.lastFirstPlayer = data.game.lastFirstPlayer;
		globalStore.player = data.game.player;
		globalStore.refetch = refetch;
	}), [data, refetch]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.toString()}</p>;
	if (!data) return <p>Acune donnée</p>;
	
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					alignItems: 'center',
					width: '100%',
					height: '100%',
				}}
			>
				{
					!data.game.currentTrick ?
						!data.game.winnedCards ?
							<div style={{ height: '152px', width: ((31 * 20) + 100) + 'px', position: 'relative' }}>
								{
									cardSet.map((c: string, i: number) =>
										<Card
											isBack={true}
											color={data.game.backColor}
											key={c}
											onClick={cut}
											onClickArg={i}
											style={{
												width: '100px',
												position: 'absolute',
												left: (i * 20) + 'px',
												zIndex: i,
											}}
										/>,
									)
								}
								<div style={{ top: '160px', position: 'absolute' }}>
									<span>Cliquez sur une carte pas trop extrême pour couper le jeu près de celle-ci (aléa entre +/-3 cartes ajouté)</span>
									<div>
										<Button text="Mélanger" onClick={shuffle} />
										<Button text="Distribuer" onClick={deal} />
									</div>
								</div>
							</div>
							:
							<div style={{ height: '404px', width: ((31 * 20) + 100) + 'px', position: 'relative' }}>
								{
									[0, 1].map((team) =>
										<React.Fragment key={team}>
											{
												data.game.winnedCards[team].map((c: string, i: number) =>
													<Card
														color={data.game.backColor}
														code={c}
														key={c}
														style={{
															width: '100px',
															position: 'absolute',
															left: (i * 20) + 'px',
															top: (team * 202) + 'px',
															zIndex: i,
														}}
													/>,
												)
											}
											<div style={{ position: 'absolute', top: (160 + (team * 202)) + 'px' }}>
												{(data.game.players[team] || "joueur " + team) + " et " + (data.game.players[2 + team] || "joueur " + (2 + team)) + " : "}
												<b>
													{
														data.game.winnedCards[team].reduce((acc: number, cur: string) =>
															acc + (({ J: 2, Q: 3, K: 4, 1: 10, A: 11 } as any)[cur.charAt(0)] || 0)
														, 0) + (valet === team ? 18 : 0) + (neuf === team ? 14 : 0) + (belote === team ? 20 : 0) + (der === team ? 10 : 0)
														+ " points"
													}
												</b>
												{" avec "}
												<label style={{ marginLeft: '5px' }}>
													<input type="checkbox" checked={valet === team} onChange={countOptions[team].valet} />valet d'atout
												</label>
												<label style={{ marginLeft: '5px' }}>
													<input type="checkbox" checked={neuf === team} onChange={countOptions[team].neuf} />9 d'atout
												</label>
												<label style={{ marginLeft: '5px' }}>
													<input type="checkbox" checked={der === team} onChange={countOptions[team].der} />10 de der
												</label>
												<label style={{ marginLeft: '5px' }}>
													<input type="checkbox" checked={belote === team} onChange={countOptions[team].belote} />belote
												</label>
											</div>
										</React.Fragment>,
									)
								}
								<div style={{ position: 'absolute', top: (200 + (1 * 202)) + 'px' }}>
									<Button text="Reformer le jeu" onClick={regroup} />
								</div>
							</div>
						:
						(
							<div style={{ height: '0px', width: '0px', position: 'relative', top: '-130px' }}>
								{
									data.game.currentTrick.map(
										(pc: { card: string, player: number }, i: number) =>
											<Card
												isBack={false}
												color={data.game.backColor}
												code={pc.card}
												key={pc.player}
												onClick={takeTrick}
												style={{
													width: '100px',
													position: 'absolute',
													left: (-(100 / 2) + (45 * getLeft((pc.player + 4 - data.game.player) % 4))) + 'px',
													top: (-(152 / 2) + (30 * getTop((pc.player + 4 - data.game.player) % 4))) + 'px',
													zIndex: i,
												}}
											/>
										,
									)
								}
								<div style={{ position: 'absolute', left: '-100px', top: '120px', fontSize: '25px', width: '150px', textAlign: 'center' }}>
									{data.game.players[(data.game.player + 0) % 4] || "joueur " + ((data.game.player + 0) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '-260px', top: '-15px', fontSize: '25px', width: '150px', textAlign: 'right' }}>
									{data.game.players[(data.game.player + 1) % 4] || "joueur " + ((data.game.player + 1) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '-100px', top: '-150px', fontSize: '25px', width: '150px', textAlign: 'center' }}>
									{data.game.players[(data.game.player + 2) % 4] || "joueur " + ((data.game.player + 2) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '110px', top: '-15px', fontSize: '25px', width: '150px', textAlign: 'left' }}>
									{data.game.players[(data.game.player + 3) % 4] || "joueur " + ((data.game.player + 3) % 4)}
								</div>
								{
									data.game.hand.map((c: string, i: number) =>
										<Card
											isBack={false}
											color={data.game.backColor}
											code={c}
											key={c}
											style={{ position: 'absolute', width: '100px', left: ((i - 4) * 45) + 'px', top: '180px' }}
											onClick={playCard}
											onClickArg={c}
										/>,
									)
								}
								<div
									style={{
										top: '350px',
										left: '-260px',
										width: '520px',
										position: 'absolute',
										alignItems: 'center',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<div style={{ margin: '10px' }}>Cliquez sur une carte pour la jouer et sur le pli pour le prendre</div>
									<div>
										{"Trier : "}
										<Button text="Sans atout" onClick={sortHand} onClickArg={null} />
										<Button text="Coeur" onClick={sortHand} small={true} onClickArg='H' />
										<Button text="Trèfle" onClick={sortHand} small={true} onClickArg='C' />
										<Button text="Carreau" onClick={sortHand} small={true} onClickArg='D' />
										<Button text="Pique" onClick={sortHand} small={true} onClickArg='S' />
									</div>
								</div>
							</div>
						)

				}
			</div>
		</div>
	);
});
