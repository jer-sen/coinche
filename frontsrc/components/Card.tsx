import * as React from "react";


export default (
	{ isBack = false, color, code = '', onClick, style, onClickArg }
	: {
		isBack?: boolean,
		color: string,
		code?: string,
		style: React.CSSProperties,
		onClick?: undefined | ((onClickArg?: any) => (void | Promise<void>)),
		onClickArg?: any
	},
) => {
	const [waiting, setWaiting] = React.useState(false);
	const handleOnClick = React.useCallback(async () => {
		setWaiting(true);
		if (onClick) await onClick(onClickArg);
		setWaiting(false);
	}, [onClick, onClickArg]);

	return (
		<img
			src={(isBack ? color + '_back.png' : code + '.png') + window.location.search}
			style={{ ...style, opacity: waiting ? 0.5 : 1 }}
			onClick={waiting ? undefined : handleOnClick}
		/>
	);
};
