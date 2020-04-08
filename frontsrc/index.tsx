import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from 'apollo-boost';
// eslint-disable-next-line import/default
import moment from 'moment-timezone';


moment.tz.setDefault("Europe/Paris");
moment.locale('fr');

import Game from "./components/Game";
import { ApolloProvider } from '@apollo/react-hooks';
import Buttons from "./components/Buttons";
import Players from "./components/Players";
import Actions from "./components/Actions";


const client = new ApolloClient({
	uri: (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://ptitecoinche.herokuapp.com') + '/graphql/',
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<div style={{ width: '100vw', height: '100vh', flexDirection: 'row', display: 'flex' }}>
			<div style={{ minWidth: '154px', flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Buttons />
				<Players />
				<Actions />
			</div>
			<div style={{ flex: 10 }}>
				<Game />
			</div>
		</div>
	</ApolloProvider>,
	document.getElementById("example"),
);
