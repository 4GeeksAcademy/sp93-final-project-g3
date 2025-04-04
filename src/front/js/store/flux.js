const getState = ({ getStore, getActions, setStore, useState }) => {
	return {
		store: {
			message: null,
			user: {},
			isLogged: false,
			isAdmin: false,
			searchResults: [],
			trips: {},
			selectedTrip: {}
		},
		actions: {
			setUser: (newUser) => { setStore({ user: newUser }) },
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setIsAdmin: (value) => { setStore({ isAdmin: value }) },
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				console.log("uri login", uri);
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "Application/json"
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options)
				console.log("login response", response)
				if (!response.ok) {
					console.log('Error login:', response.status, response.statusText)
					return
				}
				const data = await response.json();
				console.log("login all good", data);
				setStore({
					user: data.results,
					isAdmin: data.results.is_admin,
					isLogged: true,
				})
				localStorage.setItem('token', data.access_token)
				localStorage.setItem('user', JSON.stringify(data.results))
				console.log("user is logged", getStore().isLogged)
			},
			isUserLogged: () => {
				const data = JSON.parse(localStorage.getItem('user'))
				console.log(data);

				if (data) {
					setStore({
						user: data,
						isAdmin: data.is_admin,
						isLogged: true
					})
				}
			},
			logout: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				setStore({
					user: {},
					isLogged: false,
					isAdmin: false,
				})
				console.log("user is logged out")
			},
			register: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/register`;
				console.log("uri register", uri);
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "Application/json"
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options)
				console.log("register response", response)
				if (!response.ok) {
					console.log('Error registering:', response.status, response.statusText)
					return
				}
				const data = await response.json();
				console.log("register all good", data);
				setStore({
					user: data.results,
					isAdmin: data.results.is_admin,
					isLogged: true,
				})
				localStorage.setItem('token', data.access_token)
				localStorage.setItem('user', JSON.stringify(data.results))
				console.log("I'm registered", getStore().isLogged)
			},
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const response = await fetch(uri)
				if (!response.ok) {
					console.log("Error:", response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
			},
			createTrip: async (tripData) => {
				const store = getStore();
				const host_id = store.user.id;
				const uri = `${process.env.BACKEND_URL}/api/trips`;
				const token = localStorage.getItem("token");
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},
					body: JSON.stringify(tripData)
				};
				const response = await fetch(uri, options);
				console.log("create trip response", response)
				if (!response.ok) {
					console.log("Error creating trip:", response);
					return
				}
				const data = await response.json();
				console.log(data)
				setStore({ trips: data.results });

				console.log("Trip successfully created", getStore().trips)
				return data
			},
			getTrip: async (tripId) => {
				const uri = `${process.env.BACKEND_URL}/api/trips/${tripId}`;
				const token = localStorage.getItem("token");
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},

				};
				const response = await fetch(uri, options);
				console.log("getTrip response:", response);

				if (!response.ok) {
					console.log(`Error getting trip ${tripId}:`, response);
					setStore({ trips: null });
					return;
				}

				const data = await response.json();
				console.log("Data received from API:", data);

				if (data && data.results) {
					setStore({ trips: data.results });
					console.log("Store updated with:", getStore().trips);
				} else {
					console.log("Unexpected data format:", data);
				}
			},
			// setSelectedTrip: (tripId) => {
			// 	fetch(`${process.env.BACKEND_URL}/api/trips/${tripId}`)
			// 		.then(response => response.json())
			// 		.then(data => {
			// 			if (data.result) {
			// 				setStore({ selectedTrip: data.result.properties });
			// 			} else {
			// 				console.error("Invalid response from API", data);
			// 			}
			// 		}).catch(error => console.error("Error fetching details:", error));
			// },
		}
	}
};

export default getState;
