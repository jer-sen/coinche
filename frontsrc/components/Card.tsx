import * as React from "react";


export default (
	{ isBack = false, color, code = '', onClick, style }
	: { isBack?: boolean, color: string, code?: string, style: React.CSSProperties, onClick?: () => void | undefined },
) =>
	<img src={isBack ? color + '_back.png' : code + '.png'} style={style} onClick={onClick} />
;
