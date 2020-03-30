import * as React from "react";
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';


const dataQuery = gql`
	query {
		books {
			title
			author
		}
	}
`;

export default (props: { compiler: string; framework: string; }) => {
	const { loading, error, data } = useQuery(dataQuery);

  if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error}</p>;
		
	return (
		<h1>{JSON.stringify(data.books)}</h1>
	);
};