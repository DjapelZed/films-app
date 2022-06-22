const watchedFilmsDB = {
    "films": [
        {
            "id": 0,
            "title": "Stalker",
            "author": "Tarkovsky",
            "rating": 8
        },
        {
            "id": 1,
            "title": "Врата Штейна: Найти недостающее звено — Деление на ноль",
            "author": "Тиёмару Сикура",
            "rating": 9
        },
        {
            "id": 2,
            "title": "One Punch Man: Road to Hero",
            "author": "ONE",
            "rating": 10
        },
        {
            "id": 3,
            "title": "Noein: Mou Hitori no Kimi e",
            "author": "Кадзуки Аканэ",
            "rating": 7
        },
        {
            "id": 4,
            "title": "Я хочу съесть твою поджелудочную",
            "author": "Синъитиро Усидзима",
            "rating": 6
        }
    ],
    "sortBy": "name"
};

const updateLocalStorage = () => {
    localStorage.setItem("films", JSON.stringify(watchedFilmsDB.films));
}
if (!localStorage.films){
    updateLocalStorage();
} else {
    watchedFilmsDB.films = [...JSON.parse(localStorage.films)];
}

// Watched Films: List Sorting
const sortByName = () => {
    watchedFilmsDB.films.sort((a, b) => a.title.localeCompare(b.title));
};
const sortByRating = () => {
    watchedFilmsDB.films.sort((a, b) => parseInt(a.rating) < parseInt(b.rating));
};

// Watched Films: Creating List
const getWatchedList = (watchedFilms) => {
    let watchedList = "";
    watchedFilms.forEach((film, index) => {
        const row = `
        <div class="row">
            <div class="col col__order">${index+1}</div>
            <div class="col col__title">${film.title} <span class="film__author">${film.author}</span></div>
            <div class="col col__rate"><input class="rating-value" data-film-id="${film.id}" value="${film.rating}"></div>
            <div class="col col__delete hide no-select" data-film-id="${film.id}">🗑</div>
        </div>
        `;
        watchedList += row;
    });
    return watchedList;
};

// Delete Button: Delete Film
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("col__delete")){
        const id = parseInt(event.target.dataset.filmId);
        watchedFilmsDB.films = watchedFilmsDB.films.filter((film) => parseInt(film.id) !== id);
        updateWatchedListElement();
    }
});

// Delete Button: Animation 
document.addEventListener("mouseover", (event) => {
    if (event.target.closest(".col")){
        const deleteButton = event.target.parentElement.querySelector(".col__delete");
        if (deleteButton){
            deleteButton.classList.remove("hide");
        }
    }
});
document.addEventListener("mouseout", (event) => {
    if (event.target.closest(".col")){
        const deleteButton = event.target.parentElement.querySelector(".col__delete");
        if (deleteButton){
            deleteButton.classList.add("hide");
        }
    }
});

// Watched List: Render 
const watchedElement = document.querySelector(".watched__list");
const updateWatchedListElement = () => {
    if (watchedFilmsDB.sortBy == "name"){
        sortByName();
    } else if (watchedFilmsDB.sortBy == "rating"){
        sortByRating();
    }
    const watchedList = getWatchedList(watchedFilmsDB.films);
    updateLocalStorage();
    watchedElement.innerHTML = watchedList;
};
updateWatchedListElement();


// Change on click Sorting Type
const sortOptions = document.querySelectorAll(".watched-sort__item");
const updateSortOption = (event) => {
    if (event.target.classList.contains("watched-sort__item")){
        // Some CSS Decor
        sortOptions.forEach(element => {
           element.classList.remove("active") 
        });
        event.target.classList.add("active");
        // Sort by Rating
        if (event.target.id == "sortRating"){
            watchedFilmsDB.sortBy = "rating"
        }
        // Sort by Name
        if (event.target.id == "sortAbc"){
           watchedFilmsDB.sortBy = "name"
        }
        updateWatchedListElement();
    }
};
document.addEventListener("click", (event) => updateSortOption(event));

// Add a New Film 
const addForm = document.forms.addFilm;
addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const film = {
        "id": watchedFilmsDB.films.length,
        "title": `${addForm.elements.filmTitle.value}`,
        "author": `${addForm.elements.filmAuthor.value}`,
        "rating": addForm.elements.filmRating.value
    };
    watchedFilmsDB.films.push(film);
    getWatchedList(watchedFilmsDB.films);
    updateWatchedListElement();
});

// TODO: Rating Edit
document.addEventListener("focusout", (event) => {
    if (event.target.classList.contains("rating-value")){
        const filmId = parseInt(event.target.dataset.filmId);
        const newRating = parseInt(event.target.value);
        console.log(filmId, newRating);
    }
})