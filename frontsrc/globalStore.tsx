import { observable, autorun } from "mobx";

const globalStore = observable({
	gameId: JSON.parse(localStorage.getItem('gameId') || 'null'),
	token: JSON.parse(localStorage.getItem('token') || 'null'),
	actions: [],
});

autorun(() => {
	localStorage.setItem('gameId', JSON.stringify(globalStore.gameId));
	localStorage.setItem('token', JSON.stringify(globalStore.token));
});

export default globalStore;
