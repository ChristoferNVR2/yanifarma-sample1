import * as React from 'react';
import { User } from '../types';


export const UsersBox: React.FC<User> = ({ name, password, id }) => {
	return (
		<article>
			<h3>{name}</h3>
			<p>{password}</p>
			<p>{id}</p>
		</article>
	);
};
