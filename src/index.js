/**
 * es6 modules and imports
 */
import sayHello from './hello';

// sayHello('World');

/**
 * require style imports
 */
const getMovies = require('./getMovies.js');
const $ = require('jQuery');
let movieIdEdit=0;


getMovies().then((movies) => {
    let movieString = movieLoop(movies);

    $('.loading').hide();
    $('.container').removeClass("hide");
    $('.container').addClass('movie-info');
    $('.movie-list').append(movieString);

}).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
});

let movieLoop = (movies) => {
    let ul = `<ul id="movieList">`;
    movies.forEach(({title, rating, id}) => {

        ul += `<li id="movie${id}">id#${id} - ${title} - rating: ${rating}<button class="edit" type="button">Edit</button><button class="delete" type="button">Delete</button></li>`;
    });
    ul += `</ul>`;
    return ul;
};

$(".add").click(() => {
    fetch('/api/movies', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: $("#title").val(),
            rating: $(".rating:checked").val()
        })
    }).then((response) => response.json().then((movie) => $("#movieList").append(`<li id="movie${movie.id}">id#${movie.id} - ${movie.title} - rating: ${movie.rating}<button class="edit" type="button">Edit</button><button class="delete" type="button">Delete</button></li>`)));
    $("#title").val("");
    $(".rating:checked").prop("checked", false);
});

$('#commit').click(()=> {

    fetch(`/api/movies/${movieIdEdit}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            title: $("#title").val(),
            rating: $(".rating:checked").val()
        })

    }).then(response =>response.json())
    .then(movie => {
        $("ul").find(`#movie${movie.id}`).html(`id#${movie.id} - ${movie.title} - rating: ${movie.rating}<button class="edit" type="button">Edit</button><button class="delete" type="button">Delete</button>`)
    });
    $("#title").val("");
    $(".rating:checked").prop("checked", false);
    $('#submit').toggleClass('hide');
    $("#commit").toggleClass("hide");

});

$(".movie-list").delegate(".edit", "click", (e) => {
    fetch('/api/movies', {
            method: "get",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(movie => movie.json().then((movies) => {
        let working = movies.find(item => item.id === getIndex);
        $('#title').val(working.title);
        switch(working.rating){
            case '1':
                $('.rating').first().prop('checked', true);
                // console.log($('.rating').first());
                break;
            case '2':
                $('.rating').parent().next().children().first().prop('checked', true);
                // console.log($('.rating').first().next());
                break;
            case '3':
                $('.rating').parent().next().next().children().first().prop('checked', true);
                break;
            case '4':
                $('.rating').parent().next().next().next().children().first().prop('checked', true);
                break;
            case '5':
                $('.rating').parent().next().next().next().next().children().first().prop('checked', true);
                break;
        }
        $('#submit').toggleClass('hide');
        $("#commit").toggleClass("hide");


    }));

    let modifyMovie = $(e.target).parent().html();
    //returns a string.
    let idStart = modifyMovie.indexOf("#");
    let idEnd = modifyMovie.indexOf(" ");
    let getID = modifyMovie.substring(idStart + 1, idEnd);
    let getIndex = parseInt(getID);
    movieIdEdit=getIndex;
    // console.log(idStart, idEnd, getID, getIndex);
    // return getIndex;
}).delegate(".delete", "click", (e) => {
    let deleteMovie = $(e.target).parent().html();
    //returns a string.
    let idStart = deleteMovie.indexOf("#");
    let idEnd = deleteMovie.indexOf(" ");
    let getID = deleteMovie.substring(idStart + 1, idEnd);
    let deleteIndex = parseInt(getID);

    fetch(`/api/movies/${deleteIndex}`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>response.json()).then(movie => {
       console.log('delete function works.');

    });
});
