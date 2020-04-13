import { observable, autorun } from "mobx";

const globalStore = observable({
	gameId: JSON.parse(localStorage.getItem('gameId') || 'null'),
	token: JSON.parse(localStorage.getItem('token') || 'null'),
	actions: [],
	players: [],
	reverseSort: JSON.parse(localStorage.getItem('reverseSort') || 'false'),
	lastFirstPlayer: null as number | null,
	player: null as number | null,
	refetch: null as (() => void) | null,
});

autorun(() => {
	localStorage.setItem('gameId', JSON.stringify(globalStore.gameId));
	localStorage.setItem('token', JSON.stringify(globalStore.token));
	localStorage.setItem('reverseSort', JSON.stringify(globalStore.reverseSort));
});

export default globalStore;
