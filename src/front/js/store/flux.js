const getState = ({ getStore, getActions, setStore, useState }) => {
	return {
		store: {
			message: null,
			user: {},
			isLogged: false,
			isAdmin: false,
			trips: {},
			finishedTrips: [],
			searchResults: [],
			searchCriteria: {
				destination: "",
				startDate: "",
				endDate: "",
				filters: {}
			},
			favorites: [],
			users: [],
			selectedTrip: {}
		},
		actions: {
			setUser: (newUser) => { setStore({ user: newUser }) },
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setIsAdmin: (value) => { setStore({ isAdmin: value }) },
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
				getActions().getFavoriteTrips()
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
			getUsers: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/users`;
				const options = {
					method: 'GET',
					headers: { "Content-Type": "application/json" }, 
				};
				const response = await fetch(uri, options);
				console.log("get users:", response)
				if (!response.ok) {
					console.log("error getting users:", response);
					return
				}
				const data = await response.json();
				setStore({ users: data.results })
				console.log("data de get users:", data.results);
			},
			editProfile: async (profileData) => {
				const uri = `${process.env.BACKEND_URL}/api/users`;
				const token = localStorage.getItem('token');
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(profileData)
				};

				try {
					const response = await fetch(uri, options);
					const data = await response.json(); // Mover esto antes de verificar response.ok

					console.log("Response data:", data); // Agregar log para depuración

					if (!response.ok) {
						console.error("Error details:", {
							status: response.status,
							statusText: response.statusText,
							errorData: data
						});
						throw new Error(data.message || 'Failed to update profile');
					}

					const updatedUser = data.results;

					// Update store and local storage
					setStore({
						user: updatedUser
					});
					localStorage.setItem('user', JSON.stringify(updatedUser));

					return true;
				} catch (error) {
					console.error('Error updating profile:', {
						error: error,
						profileData: profileData,
						token: token
					});
					throw error;
				}
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
			searchTrips: async () => {
				const store = getStore();
				const criteria = store.searchCriteria;
				const queryParams = new URLSearchParams();

				if (criteria.destination) queryParams.append("destination", criteria.destination);
				if (criteria.startDate) queryParams.append("start_date", criteria.startDate);
				if (criteria.endDate) queryParams.append("end_date", criteria.endDate);
				if (criteria.filters?.minAge) queryParams.append("minAge", criteria.filters.minAge);
				if (criteria.filters?.maxAge) queryParams.append("maxAge", criteria.filters.maxAge);
				if (criteria.filters?.budget) queryParams.append("budget", criteria.filters.budget);
				if (criteria.filters?.sortByPrice) queryParams.append("sortByPrice", criteria.filters.sortByPrice);

				const uri = `${process.env.BACKEND_URL}/api/trips/search?${queryParams.toString()}`;

				try {
					const response = await fetch(uri);
					if (!response.ok) throw new Error("Error fetching search results");
					const data = await response.json();
					console.log("Search Results:", data.results);

					setStore({ searchResults: data.results });
				} catch (error) {
					console.error("Error during searchTrips:", error);
				}
			},
			updateSearchCriteria: (newCriteria) => {
				const store = getStore();
				setStore({
					searchCriteria: {
						...store.searchCriteria,
						...newCriteria
					}
				});
				console.log("Search criteria successfully updated", getStore().searchCriteria);
			},
			getFinishedTrips: async (page = 1) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/trips/finished?page=${page}`);
					if (!resp.ok) throw new Error("Failed to fetch finished trips");
					const data = await resp.json();
					console.log("Finished trips:", data.results);
					setStore({
						finishedTrips: data.results,
						totalPages: data.total_pages,
						currentPage: data.current_page
					});
				} catch (error) {
					console.error("Error fetching finished trips:", error);
				}
			},
			getFavoriteTrips: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/favorites`;
				const token = localStorage.getItem("token");
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},
				};
				const response = await fetch(uri, options);
				console.log("get favorites:", response)
				if (!response.ok) {
					console.log("error getting favs trips:", response);
					return
				}
				const data = await response.json();
				setStore({ favorites: data.results })
				console.log("data de get favs:", data.results);
			},
			removeFavorite: async (tripId) => {
				const store = getStore();
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/api/trips/${tripId}/favorites`;
				if (!token) throw new Error("No token found");

				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					}
				}
				const response = await fetch(uri, options)
				if (!response.ok) {
					console.log("Error deleting fav:", response)
					return
				}
				const data = await response.json();
				console.log("trip deleted from favs:", data);
				getActions().getFavoriteTrips()
				console.log(data);
			},
			addFavorite: async (tripId) => {
				const store = getStore();
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/api/trips/${tripId}/favorites`;
				if (!token) throw new Error("No token found");
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},
					body: JSON.stringify({ trip_id: tripId })
				}
				const response = await fetch(uri, options)
				if (!response.ok) {
					console.log("Error adding fav:", response)
					return
				}
				const data = await response.json();
				console.log("trip added to favs:", data);
				getActions().getFavoriteTrips()
				console.log(data);
			}

		}
	};
};

export default getState;
