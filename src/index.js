/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const getMovies = require('./getMovies.js');
const $=require('jQuery');

let ul=`<ul>`;

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log('');
    ul+=`<li>id#${id} - ${title} - rating: ${rating}</li>`;
  });

    ul+=`</ul>`;
    $('.loading').hide();
    $('.container').addClass('movie-info');
    $('.movie-list').append(ul);

}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});
