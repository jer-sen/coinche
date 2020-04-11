import * as React from "react";
import globalStore from "../globalStore";
import { observer } from "mobx-react";


const olStyle = {
	paddingLeft: '20px',
};

export default observer(() =>
	<div>
		<ol start={0} style={olStyle} >
			{
				// eslint-disable-next-line react/no-array-index-key
				globalStore.players.map((p: string, i: number) => <li key={i}>{globalStore.lastFirstPlayer === i ? <b>{p}</b> : p}</li>)
			}
		</ol>
	</div>,
);
