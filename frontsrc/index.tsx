import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from 'apollo-boost';

import Game from "./components/Game";
import { ApolloProvider } from '@apollo/react-hooks';
import Buttons from "./components/Buttons";
import Actions from "./components/Actions";


const client = new ApolloClient({
	uri: (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://ptitecoinche.herokuapp.com') + '/graphql/',
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<div style={{ width: '100vw', height: '100vh', backgroundColor: 'green', flexDirection: 'row', display: 'flex' }}>
			<div style={{ minWidth: '154px', flex: 1 }}>
				<Buttons />
			</div>
			<div style={{ flex: 10 }}>
				<Game />
			</div>
			<div style={{ minWidth: '400px', flex: 1 }}>
				<Actions />
			</div>
		</div>
	</ApolloProvider>,
	document.getElementById("example"),
);
