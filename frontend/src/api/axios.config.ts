import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
	baseURL: 'http://localhost:8000/api',
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 seconds
});

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
	config => {
		// You can add auth token here later
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error: unknown) => {
		return Promise.reject(
			error instanceof Error ? error : new Error(String(error)),
		);
	},
);

// Response interceptor (for error handling)
api.interceptors.response.use(
	response => response,
	(error: unknown) => {
		// Handle common errors
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// Server responded with error status
				console.error('API Error:', error.response.data);
			} else if (error.request) {
				// Request made but no response
				console.error('Network Error:', error.message);
			} else {
				// Something else happened
				console.error('Error:', error.message);
			}
			return Promise.reject(error);
		}
		return Promise.reject(
			error instanceof Error ? error : new Error(String(error)),
		);
	},
);

export default api;
