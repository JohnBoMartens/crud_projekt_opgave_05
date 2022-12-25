const client = {};
client.path = 'http://localhost:3000';

client.updateUser = (e) => {

    e.preventDefault();

    const { email, username } = e.currentTarget.elements;

    fetch(client.path + '/users/update', {
        method: 'PUT',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({'email' : email.value, 'username' : username.value})
    })
    .then( (response) => response.json())
    .then( (response) => {


        console.log(response)

        client.showResponse(response.message);
        client.listUsers();

    });

}

client.deleteUser = (e) => {

    e.preventDefault();

    const { email } = e.currentTarget.elements;

    let token = localStorage.getItem('token');

    if(token)
    {
        fetch(client.path + '/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({'email' : email.value})
        })
        .then((response) => response.json()).then((response) => {

            client.showResponse(response.message);
            client.listUsers();
        
        })
    }

    
}

client.submitNewUser = (e) => {

    e.preventDefault();

    const { name, email, username, zipcode, city, password, password2 } = e.currentTarget.elements;

    if(password.value === password2.value)
    {

        let newUser = {
            name : name.value,
            email : email.value,
            username : username.value,
            password : password.value,
            profile: 'default_avatar.png',
            address : {
                zipcode : zipcode.value,
                city : city.value
            }
        }

        fetch(client.path + '/users/register', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then( (response) =>  {

            client.showResponse(response.message);
            client.listUsers();
        } )
    
    } else {
        
        client.showResponse('Passwords skal være ens.');
    }
}



client.uploadUserProfileImage = (e) => {

    e.preventDefault();

    const formData = new FormData();
    const fileInput = e.currentTarget.elements.image;
    const fileName = 'profile_' + e.currentTarget.elements.id.value
    const userId = e.currentTarget.elements.id.value

    formData.append('profile', fileInput.files[0], fileName, 'png');
    formData.append('fileName', fileName);
    formData.append('userId', userId);
    formData.append('profile', fileName + '.png');

    fetch(client.path + '/users/profile', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then((response) => {

        client.showResponse(response.message);
        client.listUsers();

    })

}



client.showResponse = (message) => {
    
    const statusBar = document.querySelector('.status-bar');

    if(statusBar) {

        statusBar.textContent = message;
        statusBar.classList.add('active');

        setTimeout(() => {
            statusBar.classList.remove('active');
        }, 3000)

    }
}

client.renderUserList = (users) => {

    let userContainer = document.querySelector('.list-users-container');
    userContainer.innerHTML = '';

    const listRowHeaderTmpl = `<div class="list-users-row">
        <div><strong>ID</strong></div>
        <div><strong>USERNAME</strong></div>
        <div><strong>EMAIL</strong></div>
        <div><strong>NAME</strong></div>
        <div><strong>CITY</strong></div>
        <div><strong>ZIP</strong></div>
        <div><strong>ACTIONS</strong></div>
    </div>`

    const listRowItemTmpl = (user) => `<div class="list-users-row">
        <div><img src="/users/profiles/${user.profile}" width="50" /></div>
        <div>${user.username}</div>
        <div>${user.email}</div>
        <div>${user.name}</div>
        <div>${user.address.city}</div>
        <div>${user.address.zipcode}</div>
        <div>
            <a href="/update?id=${user._id}">update</a> | 
            <a href="/upload?id=${user._id}">upload</a>
        </div>
    </div>`


    // List Header
    userContainer.insertAdjacentHTML('beforeend', listRowHeaderTmpl);
    
 
    users.forEach( (user) => {

        // List Items
        userContainer.insertAdjacentHTML('beforeend', listRowItemTmpl(user));

    })

}

client.setupUpdateForm = () => {

    const userUpdateForm = document.querySelector('#userUpdateForm');

    if(userUpdateForm)
    {

        let params = new URLSearchParams(document.location.search);
        let id = params.get('id');

        if(id) {

            fetch(client.path + '/users/' + id, {
                method: 'GET',
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
            .then(response => response.json())
            .then((response) => {

                const {name, username, email, address } = response.result;

                userUpdateForm.elements.email.value = email;
                userUpdateForm.elements.username.value = username;
                userUpdateForm.elements.name.value = name;
                userUpdateForm.elements.zipcode.value = address.zipcode;
                userUpdateForm.elements.city.value = address.city;

            })

        }

        userUpdateForm.addEventListener('submit', client.updateUser)
    
        
    }
    
}

client.setupDeleteForm = () => {

    const userDeleteForm = document.querySelector('#userDeleteForm');

    if(userDeleteForm)
    {
        userDeleteForm.addEventListener('submit', client.deleteUser)
    }

}

client.setupNavBar = () => {

    let navBar = document.querySelector('.nav-bar');

    navBar.innerHTML = '';
    navBar.insertAdjacentHTML('beforeend', `
        <a href="/">Forside</a>
        <a href="/login">Login</a>
        <a href="/create">(C)reate</a>
        <a href="/read">(R)ead</a>
        <a href="/update">(U)pdate</a>
        <a href="/delete">(D)elete</a>
    `)
}

const loginUser = (e) => {

    e.preventDefault();

    const {email, password} = e.currentTarget.elements;

    fetch(client.path + '/users/login', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({'email': email.value, 'password': password.value})
    })
    .then(response => response.json())
    .then( (response) =>  {

        if( response.token)
        {
            // eslint-disable-next-line no-undef, no-unused-vars
            // let decoded = jwt_decode(response.token);
            // console.log('Vores brugers info fra vores token', decoded);
            localStorage.setItem('token', response.token);

        }

        client.showResponse(response.message);
      
    }).catch( (response) => client.showResponse(response.message))


}

client.setupLoginForm = () => {

    const userLoginForm = document.querySelector('#userLoginForm');

    if(userLoginForm) {
        userLoginForm.addEventListener('submit', loginUser) 
    }
    
}

client.setupCreateForm = () => {

    const userform = document.querySelector('#userform');

    if(userform)
    {
        userform.addEventListener('submit', client.submitNewUser)
    }
    
}

client.setupUploadForm = () => {

    const userProfileForm = document.querySelector('#userProfileForm');

    if(userProfileForm) {
        let params = new URLSearchParams(document.location.search);
        let id = params.get('id');

        if(id) {

            fetch(client.path + '/users/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }
            })
            .then(response => response.json())
            .then((response) => {

                const { id } = userProfileForm.elements;
                id.value = response.result._id;

            })

        }
        
        userProfileForm.addEventListener('submit', client.uploadUserProfileImage);
    }

}

client.listUsers = () => {

    const userList = document.querySelector('.list-users-container');

    if(userList) {

        fetch(client.path + '/users/all', {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then((response) => response.json())
        .then((result) => {

            client.renderUserList(result.result)

        })


    }

}

client.init = () => {

    client.setupNavBar();
    client.setupCreateForm();
    client.setupUpdateForm();
    client.setupDeleteForm();
    client.setupUploadForm();
    client.setupLoginForm();
    client.listUsers();

}

client.init();