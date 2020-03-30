import * as React from "react";

export default ({ code }: { code: string }) => {
	return (
		<img src={code + '.png'} />
	);
};