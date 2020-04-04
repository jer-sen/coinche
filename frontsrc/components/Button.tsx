import * as React from "react";

export default (
	{ text, onClick, small = false, onClickArg }
	: {
		text: string,
		small?: boolean,
		onClick?: undefined | ((onClickArg?: any) => (void | Promise<void>)),
		onClickArg?: any,
	}) => {
	const [waiting, setWaiting] = React.useState(false);

	const handleOnClick = React.useCallback(async () => {
		setWaiting(true);
		if (onClick) await onClick(onClickArg);
		setWaiting(false);
	}, [onClick, onClickArg]);

	const style = React.useMemo(() => ({
		margin: '2px',
		width: small ? '73px' : '150px',
		height: '24px',
		borderRadius: '12px',
	}), [small]);

	return <button onClick={handleOnClick} style={style} disabled={waiting} type='button'>{waiting ? '...' : text}</button>;
};
