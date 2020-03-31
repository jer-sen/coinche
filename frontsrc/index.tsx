import * as React from "react";
import * as ReactDOM from "react-dom";
import ApolloClient from 'apollo-boost';

import Hello from "./components/Hello";
import Card from "./components/Card";
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
	uri: (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://ptitecoinche.herokuapp.com') + '/graphql/',
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Hello compiler="TypeScript" framework="React" />
		<Card code="8H" />
	</ApolloProvider>,
	document.getElementById("example"),
);
