const getState = ({ getStore, getActions, setStore, useState }) => {
	return {
		store: {
			message: null,
			user: {},
			isLogged: false,
			isAdmin: false,
			trips: [],
			finishedTrips: [],
			searchResults: [],
			searchCriteria: {
				destination: "",
				startDate: "",
				endDate: "",
				filters: {}
			}
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
				setStore: ({
					user: {},
					trips: []
				})
				console.log("Trip successfully created", getStore().Trips)
				return data
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
			// Perform search & handle pagination
			performSearchFinishedTrips: async (page = 1) => {
				try {
				  const resp = await fetch(`${process.env.BACKEND_URL}/api/trips/finished?page=${page}`, {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					},
				  });
			  
				  if (!resp.ok) {
					console.error("Error response:", await resp.text());
					throw new Error(`Failed to fetch finished trips: ${resp.status}`);
				  }
			  
				  const data = await resp.json();
				  console.log("Finished trips data:", data); // Log full response
				  
				  if (!data.results || !Array.isArray(data.results)) {
					console.error("Invalid data format returned:", data);
					throw new Error("Invalid data format returned from API");
				  }
				  
				  setStore({ 
					searchResults: data.results, 
					totalPages: data.total_pages || 1, 
					currentPage: data.current_page || page 
				  });
				  
				  return true;
				} catch (error) {
				  console.error("Error fetching finished trips:", error);
				  return false;
				}
			  },

			// Verificar si un viaje está en favoritos
			checkIfFavorite: async (tripId) => {
				try {
					const token = localStorage.getItem("token");
					if (!token) return false;

					const resp = await fetch(`${process.env.BACKEND_URL}/api/favorites/check/${tripId}`, {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + token
						}
					});

					if (!resp.ok) return false;
					const data = await resp.json();
					return data.is_favorite;
				} catch (error) {
					console.error("Error checking favorite status:", error);
					return false;
				}
			},

			// Quitar un viaje de favoritos
			removeFavorite: async (tripId) => {
				try {
					const token = localStorage.getItem("token");
					const resp = await fetch(`${process.env.BACKEND_URL}/api/trips/${tripId}/favorites`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						}
					});

					if (!resp.ok) throw new Error("Failed to remove favorite");
					console.log("Trip removed from favorites:", tripId);
					return true;
				} catch (error) {
					console.error("Error removing favorite:", error);
					return false;
				}
			},

			// Toggle favorito mejorado (añadir o quitar según el estado actual)
			toggleFavorite: async (tripId) => {
				try {
					const store = getStore();
					const token = localStorage.getItem("token");

					// Primero comprobamos si ya es favorito
					const isFavorite = await getActions().checkIfFavorite(tripId);

					// Según el resultado, añadimos o quitamos
					const method = isFavorite ? "DELETE" : "POST";

					const resp = await fetch(`${process.env.BACKEND_URL}/api/trips/${tripId}/favorites`, {
						method: method,
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						}
					});

					if (!resp.ok) throw new Error(`Failed to ${isFavorite ? 'remove' : 'add'} favorite`);
					console.log(`Trip ${isFavorite ? 'removed from' : 'added to'} favorites:`, tripId);

					// Actualizamos la lista de favoritos en el store si es necesario
					if (store.favoriteTrips) {
						if (isFavorite) {
							setStore({
								favoriteTrips: store.favoriteTrips.filter(trip => trip.id !== tripId)
							});
						} else {
							// Aquí podrías hacer un fetch al trip para añadirlo a favoritos
							// O simplemente recargar la lista completa
						}
					}

					return true;
				} catch (error) {
					console.error("Error toggling favorite:", error);
					return false;
				}
			},

			// Obtener todos los favoritos del usuario
			getFavoriteTrips: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) return;

					const resp = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
						headers: {
							"Authorization": "Bearer " + token
						}
					});

					if (!resp.ok) throw new Error("Failed to fetch favorites");
					const data = await resp.json();
					setStore({ favoriteTrips: data.results });
					console.log("Favorite trips loaded:", data.results);
				} catch (error) {
					console.error("Error fetching favorites:", error);
				}
			}
		}
	};
};

export default getState;
