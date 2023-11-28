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
			user: {},
			logged: false,
			incomes: [],
			incomecategories: null,
			ocassionals: [],
			ocassionalcategories: null,
			fixes: [],
			fixedcategories: null,
			saves: [],
			token: "",
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

			setIncome: async (dateTime,incomecategory_id,value) => {
				const store = getStore();
				const response = await fetch (process.env.BACKEND_URL + "api/income", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						incomecategory_id,
						dateTime,
					})
				})
				const income = await response.json()
				setStore({...store, income})
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

			setFixed: async (dateTime,fixedcategory_id,value) => {
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
						dateTime,
					})
				})
				const fixes = await response.json()
				setStore({...store, fixes})
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

			setOcassional: async (dateTime,ocassionalcategory_id,value) => {
				const store = getStore();
				const response = await fetch (process.env.BACKEND_URL + "api/ocassional", {
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						value,
						ocassionalcategory_id,
						dateTime,
					})
				})
				const ocassional = await response.json()
				setStore({...store, ocassional})
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

			setSave: async (dateTime,ocassionalcategory_id,value) => {
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
						dateTime,
					})
				})
				const save = await response.json()
				setStore({...store, save})
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

