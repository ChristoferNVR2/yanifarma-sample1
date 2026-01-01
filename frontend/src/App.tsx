import { useEffect, useState } from 'react';
import './App.css';
import { UsersBox } from './components/UsersBox.tsx';
import { type User } from './types';
import { CreateUser } from './components/CreateUser.tsx';

function App() {
	const [users, setUsers] = useState<User[]>([]);
	useEffect(() => {
		fetch('http://172.21.0.3:8000/api/users')
			.then(response => response.json())
			.then((data: User[]) => setUsers(data))
			.catch(error => console.error('Error fetching users:', error));
	}, []);
	return (
		<main>
			<h1>FastAPI with React</h1>
			<CreateUser />
			{
				users.map(user => (
					<UsersBox key={user.id} id={user.id} name={user.name} password={user.password} />
				))
			}
		</main>
	);
}

export default App;
