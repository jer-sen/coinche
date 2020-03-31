import * as React from "react";

export default ({ text, onClick, small = false }: { text: string, small?: boolean, onClick: () => Promise<void> | void }) => {
	const [waiting, setWaiting] = React.useState(false);

	const onClickHandler = React.useCallback(async () => {
		setWaiting(true);
		await onClick();
		setWaiting(false);
	}, [setWaiting, onClick]);

	const style = React.useMemo(() => ({
		margin: '2px',
		width: small ? '73px' : '150px',
		height: '24px',
		borderRadius: '12px',
	}), [small]);

	return <button onClick={onClickHandler} style={style} disabled={waiting} type='button'>{waiting ? '...' : text}</button>;
};
