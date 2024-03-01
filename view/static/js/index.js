function checkLoginState() {
    FB.login(function (response) {
        if (response.status === 'connected') {
            FB.api('/me', async function (response) {
                try {
                    await fetch('/user/loginWithFacebook', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({facebookId: response.id, name: response.name}),
                        credentials: 'include',
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Success:', data)
                        })
                        .catch((error) => {
                            console.error('Error:', error)
                        })
                    window.location.replace('/')
                } catch (err) {
                    console.error(err.message)
                }
            })
        } else {
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this webpage.'
        }
    })
}


window.fbAsyncInit = function () {
    FB.init({
        appId: '936700521399127',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
    })
}