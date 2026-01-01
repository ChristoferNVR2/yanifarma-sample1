import { ChangeEvent, FormEvent, useState } from 'react';

export const CreateUser = () => {
	const [textName, setTextName] = useState<string>('');
	const [textPassword, setTextPassword] = useState<string>('');

	const handleInputName = (event: ChangeEvent<HTMLInputElement>) => {
		setTextName(event.target.value);
	};

	const handleInputPassword = (event: ChangeEvent<HTMLInputElement>) => {
		setTextPassword(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Creating user:', { name: textName, password: textPassword });
		fetch('http://localhost:8000/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: textName,
				password: textPassword,
			}),
		})
			.then(response => response.json())
			.then(data => {
				console.log('Success:', data);
				setTextName('');
				setTextPassword('');
			})
			.catch(error => {
				console.error('Error:', error);
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='name'>Name:</label>
			<input
				type='text'
				id='name'
				onChange={handleInputName}
				value={textName}
			/>
			<label htmlFor='password'>Password:</label>
			<input
				type='text'
				id='password'
				onChange={handleInputPassword}
				value={textPassword}
			/>
			<input type='submit' value='Create User' />
		</form>
	);
};
