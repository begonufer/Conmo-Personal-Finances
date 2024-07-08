const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			months:  [
				'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
				'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
			],
			movements: [],
			user: {},
			logged: false,
			incomes: [],
			incomecategories: null,
			ocassionals: [],
			ocassionalcategories: null,
			fixes: [],
			fixedcategories: null,
			saves: [],
			usages: [],
			token: "",
			listeners: [],
		},
		actions: {
			setNewUser: async (name,surname,email,password) => {
				const response = await fetch (process.env.BACKEND_URL + "api/user", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
					},
					body: JSON.stringify({
						name,
						surname,
						email,
						password
					})
				})
				const newuser = await response.json()
				setStore({...getStore(), user: newuser})
			},

			setUser: async (email, password) => {
				const response = await fetch (process.env.BACKEND_URL + "api/user/login", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
					},
					body: JSON.stringify({
						email,
						password
					})
				})
				if (!response.ok) {
					throw new Error("Email o contraseña incorrectos.");
				}			
				const user = await response.json()
				if (user.token){
					localStorage.setItem('token', user.token)
					getActions().setLogged(true)
				}
				setStore({...getStore(), token:user.token, user})
			},

			setLogged: (logged) => {
				setStore({logged:logged})
			},

			clearUser: () => {
				localStorage.removeItem('token')
				getActions().setLogged(false)
				setStore({...getStore(), token: '', user: {}})
			},

			subscribeToType: (types, listener) => {
				const { listeners } = getStore();
				setStore({ ...getStore(), listeners: [...listeners, { types, listener }] });
			
				return () => {
					const index = listeners.findIndex((item) => item.listener === listener);
					if (index !== -1) {
						listeners.splice(index, 1);
						setStore({ ...getStore(), listeners: [...listeners] });
					}
				};
			},

			notifyTypeChange: (types) => {
				const { listeners } = getStore();
				listeners.forEach((item) => {
					if (types.some((type) => item.types.includes(type))) {
						item.listener();
					}
				});
			},

			setIncome: async (dateTime, incomecategory_id, incomecategory_name, value) => {
				const store = getStore();
				const response = await fetch(process.env.BACKEND_URL + "api/income", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						incomecategory_id,
						incomecategory_name, 
						dateTime
					})
				});
				const newIncome = await response.json();
				setStore({
					...store,
					income: { ...store.income, ...newIncome },
					incomes: [...store.incomes, newIncome]
				});
				console.log(store.incomes);
				getActions().notifyTypeChange(['incomes']);
			},
			
			setSaved: async (dateTime, ocassionalcategory_id, ocassionalcategory_name, value) => {
				const store = getStore();
				const response = await fetch (process.env.BACKEND_URL + "api/save", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						ocassionalcategory_id,
						ocassionalcategory_name,
						dateTime
					})
				})
				const newSaved = await response.json();
				setStore({
					...store,
					save: { ...store.save, ...newSaved },
					saves: [...store.saves, newSaved]
				});
				console.log(store.saves);
				getActions().notifyTypeChange(['saves']);
			},
			
			setUsage: async (dateTime, ocassionalcategory_id, ocassionalcategory_name, value) => {
				const store = getStore();
				const response = await fetch (process.env.BACKEND_URL + "api/usage", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						ocassionalcategory_id,
						ocassionalcategory_name,
						dateTime
					})
				})

				const newUsage = await response.json();
				setStore({
					...store,
					usage: { ...store.usage, ...newUsage },
					usages: [...store.usages, newUsage]
				});
				console.log(store.usages);
				getActions().notifyTypeChange(['usages']);
			},

			setFixed: async (dateTime,fixedcategory_id,fixedcategory_name,value) => {
				const store = getStore();
				const response = await fetch (process.env.BACKEND_URL + "api/fixed", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						fixedcategory_id,
						fixedcategory_name,
						dateTime,
					})
				})
				const newFixed = await response.json();
				setStore({
					...store,
					fixed: { ...store.fixed, ...newFixed },
					fixes: [...store.fixes, newFixed]
				});
				console.log(store.fixes);
				getActions().notifyTypeChange(['fixes']);
			},
			
			setOcassional: async (dateTime, ocassionalcategory_id, ocassionalcategory_name, value) => {
				const store = getStore();
				const response = await fetch(process.env.BACKEND_URL + "api/ocassional", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						ocassionalcategory_id,
						ocassionalcategory_name,
						dateTime,
					})
				});
				const newOcassional = await response.json();
				setStore({
					...store,
					ocassionals: [...store.ocassionals, newOcassional]
				});
				console.log(store.ocassionals);
				getActions().notifyTypeChange(['ocassionals']);
			},
			
			setIncomeCategory: async (value) => {
				try {
				   const response = await fetch(process.env.BACKEND_URL + "api/incomecategory", {
					  method: "POST",
					  headers: {
						 "Content-Type": "application/json",
						 "Authorization": `Bearer ${localStorage.getItem('token')}`
					  },
					  body: JSON.stringify({ value })
				   });
			 
				   if (!response.ok) {
					  const errorText = await response.text();
					  throw new Error(`Error al agregar la categoría ingreso. Estado: ${response.status}. Detalles: ${errorText}`);
				   }
			 
				   const newCategory = await response.json();
				   return newCategory;
				} catch (error) {
				   console.error("Error al agregar la categoría ingreso:", error);
				   throw error;
				}
			},

			setFixedCategory: async (value) => {
				try {
				   const response = await fetch(process.env.BACKEND_URL + "api/fixedcategory", {
					  method: "POST",
					  headers: {
						 "Content-Type": "application/json",
						 "Authorization": `Bearer ${localStorage.getItem('token')}`
					  },
					  body: JSON.stringify({ value })
				   });
			 
				   if (!response.ok) {
					  const errorText = await response.text();
					  throw new Error(`Error al agregar la categoría fijo. Estado: ${response.status}. Detalles: ${errorText}`);
				   }
			 
				   const newCategory = await response.json();
				   return newCategory;
				} catch (error) {
				   console.error("Error al agregar la categoría fijo:", error);
				   throw error;
				}
			},
			
			setOcassionalCategory: async (value) => {
				try {
				   const response = await fetch(process.env.BACKEND_URL + "api/ocassionalcategory", {
					  method: "POST",
					  headers: {
						 "Content-Type": "application/json",
						 "Authorization": `Bearer ${localStorage.getItem('token')}`
					  },
					  body: JSON.stringify({ value })
				   });
			 
				   if (!response.ok) {
					  const errorText = await response.text();
					  throw new Error(`Error al agregar la categoría ocasional. Estado: ${response.status}. Detalles: ${errorText}`);
				   }
			 
				   const newCategory = await response.json();
				   return newCategory;
				} catch (error) {
				   console.error("Error al agregar la categoría ocasional:", error);
				   throw error;
				}
			},

			getIncomes: async() => {
                const response = await fetch (process.env.BACKEND_URL + "api/income", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const incomes = await response.json();
                setStore({ ...getStore(), incomes });
            },

			getSaves: async() => {
                const response = await fetch (process.env.BACKEND_URL + "api/save", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const saves = await response.json();
                setStore({ ...getStore(), saves });
            },

			getUsage: async() => {
                const response = await fetch (process.env.BACKEND_URL + "api/usage", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const usages = await response.json();
                setStore({ ...getStore(), usages });
            },
			
			getFixes: async() => {
                const response = await fetch (process.env.BACKEND_URL + "api/fixed", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const fixes = await response.json();
                setStore({ ...getStore(), fixes });
            },
			
			getOcassionals: async() => {
                const response = await fetch (process.env.BACKEND_URL + "api/ocassional", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const ocassionals = await response.json();
                setStore({ ...getStore(), ocassionals });
            },

			getIncomeCategories: async() => {
				const response = await fetch (process.env.BACKEND_URL + "api/incomecategories", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
				})
				const incomecategories = await response.json();
				setStore({...getStore(), incomecategories });
			},

			getFixedCategories: async() => {
				const response = await fetch (process.env.BACKEND_URL + "api/fixedcategories", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
				})
				const fixedcategories = await response.json();
				setStore({...getStore(), fixedcategories });
			},
			
			getOcassionalCategories: async() => {
				const response = await fetch (process.env.BACKEND_URL + "api/ocassionalcategories", {
                    method: 'GET',
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
				})
				const ocassionalcategories = await response.json();
				setStore({...getStore(), ocassionalcategories });
			},
			
			getMovementsByCategory: async (category_id, endpoint) => {
				try {
					const response = await fetch( process.env.BACKEND_URL + `api/${endpoint}/${category_id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						},
					});
					if (response.ok) {
						const movements = await response.json();
						setStore({ ...getStore(), movements });
					} else {
						console.error(`Error getting movements by category. Status: ${response.status}`);
						return [];
					}
				} catch (error) {
					console.error('Error:', error.message);
					return [];
				}
			},
						
			deleteIncomeCategory: async (incomecategory_id) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/incomecategory/${incomecategory_id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
					});
					if (response.ok) {
						console.log(`Category with ID ${incomecategory_id} delete.`);
					} else {
						console.error(`Error to delete category with ID ${incomecategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error en la solicitud de eliminación: ${error.message}`);
				}
			},

			deleteFixedCategory: async (fixedcategory_id) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/fixedcategory/${fixedcategory_id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
					});
					if (response.ok) {
						console.log(`Category with ID ${fixedcategory_id} delete.`);
					} else {
						console.error(`Error to delete category with ID ${fixedcategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error en la solicitud de eliminación: ${error.message}`);
				}
			},

			deleteOcassionalCategory: async (ocassionalcategory_id) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/ocassionalcategory/${ocassionalcategory_id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
					});
					if (response.ok) {
						console.log(`Category with ID ${ocassionalcategory_id} delete.`);
					} else {
						console.error(`Error to delete category with ID ${ocassionalcategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error en la solicitud de eliminación: ${error.message}`);
				}
			},
			
			deleteMovement: async (movement_id, endpoint, typeData) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/${endpoint}/${movement_id}`, {
						method: 'DELETE',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
					});
					if (response.ok) {
						console.log(`Movement with ID ${movement_id} delete.`);
						getActions().notifyTypeChange([typeData]);
					} else {
						console.error(`Error to delete movement with ID ${movement_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error en la solicitud de eliminación: ${error.message}`);
				}
			},
						
			modifyIncomeCategory: async (incomecategory_id, newCategoryName) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/incomecategory/${incomecategory_id}`, {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify({
							name: newCategoryName,
						}),
					});
				
					if (response.ok) {
						console.log(`Category with ID ${incomecategory_id} modified.`);
					} else {
						console.error(`Error to modify category with ID ${incomecategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error in modification request: ${error.message}`);
				}
			},

			modifyFixedCategory: async (fixedcategory_id, newCategoryName) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/fixedcategory/${fixedcategory_id}`, {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify({
							name: newCategoryName,
						}),
					});
				
					if (response.ok) {
						console.log(`Category with ID ${fixedcategory_id} modified.`);
					} else {
						console.error(`Error to modify category with ID ${fixedcategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error in modification request: ${error.message}`);
				}
			},

			modifyOcassionalCategory: async (ocassionalcategory_id, newCategoryName) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `api/ocassionalcategory/${ocassionalcategory_id}`, {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify({
							name: newCategoryName,
						}),
					});
				
					if (response.ok) {
						console.log(`Category with ID ${ocassionalcategory_id} modified.`);
					} else {
						console.error(`Error to modify category with ID ${ocassionalcategory_id}. ${response.status}`);
					}
				} catch (error) {
					console.error(`Error in modification request: ${error.message}`);
				}
			},





			
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;

