import { useTransition } from "react";

const getState = ({ getStore, getActions, setStore, useState }) => {
	return {
		store: {
			message: null,
			user: {},
			isLogged: false,
			isAdmin: false,
			trips: {},
			myTrips: [],
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
			setSelectedTrip: (value) => { setStore({ selectedTrip: value }) },
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
				getActions().getMyTrips()
				console.log("login my trips:", getStore().myTrips)
			},
			isUserLogged: () => {
				const token = localStorage.getItem("token");
				const user = localStorage.getItem("user");
				if (!token || !user) {
					// Limpieza adicional por seguridad
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					setStore({
						user: {},
						isLogged: false,
						isAdmin: false
					});
					return;
				}
				const parsedUser = JSON.parse(user);
				setStore({
					user: parsedUser,
					isAdmin: parsedUser.is_admin,
					isLogged: true
				});
			},
			logout: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				setStore({
					user: {},
					isLogged: false,
					isAdmin: false,
					trips: {},
					favorites: []
				});
				console.log("user is logged out");
				// Opcional: recarga para resetear cualquier estado residual
				window.location.href = "/"; // o usa navigate("/") si estás usando React Router
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
			updateProfilePhoto: async (photo) => {
				const uri = `${process.env.BACKEND_URL}/api/user/photo`;
				const token = localStorage.getItem('token');
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
					body: JSON.stringify(photo),
				};
				try {
					const response = await fetch(uri, options);
					const data = await response.json();
					console.log("Response data update photo:", data);
					if (!response.ok) {
						console.error("Error details:", {
							status: response.status,
							statusText: response.statusText,
							errorData: data,
						});
						throw new Error(data.message || 'Failed to update photo');
					}
					const updatedUser = data.results;
					setStore({
						user: updatedUser, // Actualiza el estado global del usuario
					});
					localStorage.setItem('user', JSON.stringify(updatedUser)); // Guarda la información en localStorage
					return true;
				} catch (error) {
					console.error('Error updating profile:', {
						error: error,
						photo: photo,
						token: token,
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
			updateTripPhoto: async (photoData) => {
				// Extraer el ID del viaje y la URL de la foto
				const { photoUrl, tripId } = photoData;

				console.log("Actualizando foto para el viaje ID:", tripId);
				console.log("URL de la nueva foto:", photoUrl);

				const uri = `${process.env.BACKEND_URL}/api/trips/${tripId}`;
				const token = localStorage.getItem('token');
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
					body: JSON.stringify({ photo: photoUrl }),
				};
				try {
					const response = await fetch(uri, options);
					const data = await response.json();
					console.log("Response data update trip photo:", data);
					if (!response.ok) {
						console.error("Error details:", {
							status: response.status,
							statusText: response.statusText,
							errorData: data,
						});
						throw new Error(data.message || 'Failed to update photo');
					}

					// Actualizar el viaje seleccionado con los datos recibidos
					const updatedTrip = data.results;
					setStore({
						selectedTrip: updatedTrip,
						trips: updatedTrip
					});

					console.log("Trip actualizado en el store:", updatedTrip);
					return true;
				} catch (error) {
					console.error('Error updating trip photo:', {
						error: error,
						photoData: photoData,
					});
					throw error;
				}
			},
			updateTrip: async (tripId, data) => {
				try {
					const token = localStorage.getItem('token');
					const response = await fetch(`${process.env.BACKEND_URL}/api/trips/${tripId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(data)
					});

					if (!response.ok) throw new Error('Failed to update trip');
					return await response.json();
				} catch (error) {
					console.error("Error updating trip:", error);
					throw error;
				}
			},
			getTrips: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/trips`;
				const options = {
					method: 'GET',
					headers: { "Content-Type": "application/json" },
				};
				const response = await fetch(uri, options);
				console.log("get trips:", response)
				if (!response.ok) {
					console.log("error getting trips:", response);
					return
				}
				const data = await response.json();
				setStore({ trips: data.results })
				console.log("data de get trips:", data.results);
			},
			getMyTrips: async (page = 1) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/user/mytrips?page=${page}`;
				const token = localStorage.getItem("token");
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},
				};
				const response = await fetch(uri, options);
				console.log("get my trips:", response)
				if (!response.ok) {
					console.log("error getting my trips:", response);
					return
				}
				const data = await response.json();
				console.log("Data recieved from getMyTrips:", data)
				setStore({ myTrips: data.mytrips })
				console.log("data de get my trips", data.mytrips);
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
			searchTrips: async (criteria) => {
				const store = getStore();
				// const criteria = store.searchCriteria;
				console.log(criteria)

				const uri = `${process.env.BACKEND_URL}/api/trips/search?${criteria}`
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
			performSearch: () => {

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
			getFavoriteTrips: async (page = 1) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/favorites?page=${page}`;
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
