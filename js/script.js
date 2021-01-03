//HELPER FUNCITONS
const getById = id => document.getElementById(id)
const query = element => document.querySelector(element)

//CONSTANS
const url = 'https://randomuser.me/api/?results=12&nat=us';
const gallery = getById("gallery");
const searchContainer = query(".search-container");
const usersArr = [];

//GENERATES THE SEARCH BAR AND INSERTS IT INTO IT'S CONTAINER
function generateSearch () {

    const serachElement =
    `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    searchContainer.insertAdjacentHTML("beforeend",serachElement)
}

//GENERATES AND DISPLAYS ALL THE USERS CARDS
function generateCard (user) {

    const card = `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>`

    gallery.insertAdjacentHTML("beforeend",card);
}

//GENERATES A MODAL WHEN CALLED AND CONTROL IT'S BEHAVIOUR
//userIndex AND arr ARGUMENTS ARE USED TO KEPP TRACK OF THE CURRENT USER OR USERS THAT IS DISPLAYED ON THE MODAL
function generateModal (user,userIndex,arr) {

    const date = new Date(user.dob.date)

    const userModal = 
    `<div class="modal-container">

        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street.number}, ${user.location.street.name}, ${user.location.country}, ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}</p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`
    
    query("body").insertAdjacentHTML("beforeend",userModal)

    const currentModal = query(".modal-container");
    const closeModal = getById("modal-close-btn");
    const next = getById("modal-next");
    const prev = getById("modal-prev");

    // IF THE VALUE OF USER INDEX IS EQUAL TO ARR.LENGTH -1 SET NEXT.DISPLAY TO NONE ELSE TO BLOCK
    next.style.display = userIndex === arr.length - 1 ? "none":"block"

    next.addEventListener('click',() => {

        if (userIndex < arr.length - 1) {

            userIndex += 1
            currentModal.remove()
            generateModal(arr[userIndex],userIndex,arr)

        }
    })

    prev.style.display = userIndex === 0 ? "none":"block"

    prev.addEventListener('click',() => {

        if (userIndex > 0 && userIndex < arr.length) {

            userIndex -= 1
            currentModal.remove()
            generateModal(arr[userIndex],userIndex,arr)
        }
    })

    currentModal.addEventListener("click",(e) => e.target.className === "modal-container" ? currentModal.remove() : null)
    closeModal.addEventListener('click', () => currentModal.remove());
}

//MAKES THE REQUEST TO THE API AND RETURNS A PROMISE
async function getUsers (url) {

    const response = await fetch(url);
    const users = await response.json()
    return users.results

}

//FILL usersArr,SEND THE DATA TO generateCard AND CALLS appendListeners
getUsers(url)
    .then(data => data.forEach(user => { generateCard(user),usersArr.push(user) }))
    .then(appendListeners)
    .catch( () => gallery.innerHTML += `<h3>There was an error with the request</h3>`)

generateSearch()

//APPEND AN EVENT LISTENER TO EVERY USER CARD ON THE PAGE
//AND GENERATES A MODAL WHEN ANY IS CLICKED
function appendListeners (users) {

    const usersCards = document.querySelectorAll(".card");

    for (let i = 0; i < usersCards.length; i++) {

        usersCards[i].addEventListener("click", () => {

            users ? generateModal(users[i],i,users) : generateModal(usersArr[i],i,usersArr)

        })
    }
}

//SEARCH FUNCTIONALITY
const search = getById("search-input");
const submit = getById("search-submit")

function searchFn (search,users) {

    const filteredUsers = [];
 
    for ( let user of users) {

       let userFullName = user.name.first.toLowerCase()+" "+ user.name.last.toLowerCase();
       
        if (search.length > 0 && userFullName.includes( search.toLowerCase().trim("") )) {

           filteredUsers.push(user)
        }

    }

    return filteredUsers;
}
 
function searchControl (query,users) {

    //IF NO INPUT PROVIDED TO SEARCH FOR USERS,RETURN FETCHED USERS.
    if (query.length == 0 ) {

        gallery.innerHTML = "";
        usersArr.forEach(user => generateCard(user))
        appendListeners()
        return false
    }
 
    //IF THE INPUT PROVIDED DIT NOT MATCH ANY FILTERED USERS.
    else if (users.length == 0) {
    
        //CLEAN THE CURRENT LIST OF USERS TO INSERT A NOT FOUND MESSAGE.
        gallery.innerHTML = "";
        gallery.innerHTML = "<h3>No matchs were found :( </h3>";
        return false
    }

    gallery.innerHTML = ""
    users.forEach(generateCard)

    return true
}

search.addEventListener("keyup",() => {

    const filteredUsers = searchFn(search.value,usersArr)

    searchControl(search.value,filteredUsers) ? appendListeners(filteredUsers) : null
});

submit.addEventListener("click", e => e.preventDefault())









