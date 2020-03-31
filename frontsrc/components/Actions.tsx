import * as React from "react";
import globalStore from "../globalStore";
import { observer } from "mobx-react";


export default observer(() =>
	<div>
		<ul>
			{
				[...globalStore.actions].reverse().slice(0, 20).map((a: string) => <li key={a}>{a}</li>)
			}
		</ul>
	</div>,
);
