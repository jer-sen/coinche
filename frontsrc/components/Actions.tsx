import * as React from "react";
import globalStore from "../globalStore";
import { observer } from "mobx-react";


export default observer(() =>
	<div>
		<ol start={0} >
			{
				// eslint-disable-next-line react/no-array-index-key
				globalStore.players.map((p: string, i: number) => <li key={i}>{p}</li>)
			}
		</ol>
		<ul>
			{
				[...globalStore.actions].reverse().slice(0, 20).map((a: string) => <li key={a}>{a}</li>)
			}
		</ul>
	</div>,
);
