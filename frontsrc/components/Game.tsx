import * as React from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { observer } from "mobx-react";

import globalStore from "../globalStore";
import Card from "./Card";
import { action } from "mobx";


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
			lastDealer
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

export default observer(() => {
	const skip = !globalStore.gameId || !globalStore.token;
	const { loading, error, refetch, data } = useQuery(dataQuery, {
		variables: { id: globalStore.gameId, token: globalStore.token },
		skip,
		pollInterval: skip ? undefined : 1000,
	});

	const [playCardMutation] = useMutation(playCardMutationDoc);
	const [takeTrickMutation] = useMutation(takeTrickMutationDoc);

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

	React.useEffect(action(() => {
		if (!data) return;
		globalStore.actions = data.game.actions;
		globalStore.players = data.game.players;
		globalStore.lastDealer = data.game.lastDealer;
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
											style={{
												width: '100px',
												position: 'absolute',
												left: (i * 20) + 'px',
												zIndex: i,
											}}
										/>,
									)
								}
							</div>
							:
							<div style={{ height: '404px', width: ((31 * 20) + 100) + 'px', position: 'relative' }}>
								{
									[0, 1].map((team) =>
										data.game.winnedCards[team].map((c: string, i: number) =>
											<>
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
												/>
												<div style={{ position: 'absolute', top: (160 + (team * 202)) + 'px' }}>
													{(data.game.players[team] || "joueur " + team) + " et " + (data.game.players[2 + team] || "joueur " + (2 + team)) + " : "}
													<b>
														{
															data.game.winnedCards[team].reduce((acc: number, cur: string) =>
																acc + (({ J: 2, Q: 3, K: 4, 1: 10, A: 11 } as any)[cur.charAt(0)] || 0)
															, 0) + " points"
														}
													</b>
													{" sans valet (+18) ni 9 (+14) d'atout, ni 10 de der, ni belote"}
												</div>
											</>,
										),
									)
								}
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
								<div style={{ position: 'absolute', left: '-200px', top: '120px', fontSize: '30px', width: '400px', textAlign: 'center' }}>
									{data.game.players[(data.game.player + 0) % 4] || "joueur " + ((data.game.player + 0) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '-550px', top: '-15px', fontSize: '30px', width: '400px', textAlign: 'right' }}>
									{data.game.players[(data.game.player + 1) % 4] || "joueur " + ((data.game.player + 1) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '-200px', top: '-150px', fontSize: '30px', width: '400px', textAlign: 'center' }}>
									{data.game.players[(data.game.player + 2) % 4] || "joueur " + ((data.game.player + 2) % 4)}
								</div>
								<div style={{ position: 'absolute', left: '150px', top: '-15px', fontSize: '30px', width: '400px', textAlign: 'left' }}>
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
							</div>
						)

				}
			</div>
		</div>
	);
});
