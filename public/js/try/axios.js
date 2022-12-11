axios.defaults.withCredentials = true

function handleResult(res) {
    console.log(res)
}

// GET
// axios.get('/try')
//     .then((res) => handleResult(res))
//     .catch((err) => console.log(err))

// POST


setTimeout(() => {
    axios({
        method: 'post',
        url: '/try',
        params: {
            yep: 'yep'
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
            campground: {
                title: 'Axios Axios Axios',
                price: 444,
                description: 'xddddddddddddd',
                location: 'Marana, Arizona'
            }
        }
    })
        .then((res) => handleResult(res))
        .catch((err) => console.log(err));
}, 200);