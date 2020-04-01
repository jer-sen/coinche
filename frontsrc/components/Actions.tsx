import * as React from "react";
import globalStore from "../globalStore";
import { observer } from "mobx-react";
// eslint-disable-next-line import/default
import moment from 'moment-timezone';


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
				[...globalStore.actions].reverse().slice(0, 20).map(
					(a: { text: string, ticks: number }) =>
						<li key={a.text} title={moment(a.ticks).format('[ le ]DD/MM/YYYY[ à ]HH:mm:ss')}>{a.text}</li>
					,
				)
			}
		</ul>
	</div>,
);
