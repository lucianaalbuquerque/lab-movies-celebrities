const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");
const Movie = require('../models/Movie.model')

router.get('/movies/create', (req,res,next) => {
    Celebrity.find()
    .then((celebrities) => res.render('movies/new-movie', {celebrities}))
    .catch((err) => next(err))
})

router.post('/movies/create', (req,res,next) => {
    const {title, genre, plot, cast} = req.body
    Movie.create( {title, genre, plot, cast} )
        .then(() => {
            res.redirect('/movies')
        })
        .catch((err) => {res.redirect('/movies/create')})
})

router.get('/movies', (req,res,next) => {
    Movie.find()
    .then((moviesList) => res.render('movies/movies', {moviesList}))
    .catch((err) => next(err))
})

router.get('/movies/:movieId', (req,res,next) => {
    const { movieId } = req.params
    Movie.findById(movieId)
    .populate('cast')
    .then((movieFound) => {
        const cast = movieFound.cast;
        res.render('movies/movie-details', movieFound)})
    .then((cast) => res.render('movies/movie-details', cast))
    .catch((err) => next(err))
})

router.post('/movies/:id/delete', (req,res,next) =>  {
    const {id} = req.params
    console.log(id)
    Movie.findByIdAndDelete(id)
    .then((deletedMovie) => res.redirect('/movies'))
    .catch((err) => next(err))
})

router.get('/movies/:id/edit', (req,res,next) =>{
   const {id} = req.params;

   Movie.findById(id)
    .populate('cast')
    .then((movieFound) => {
        const cast = movieFound.cast 
        res.render('movies/edit-movie', {movie: movieFound})
    })
    .then((cast) => res.render('movies/edit-movie', {cast}))
    .then(() => {
        Celebrity.find()
        .then((celebrities) => res.render('movies/edit-movie', {celebrities}))
        
    })
    .catch((err) => next(err))

    
})

router.post('/movies/:id/edit', (req,res,next) =>{
    const {id} = req.params;
    const {title, genre, plot, cast} = req.body;

    Movie.findByIdAndUpdate(id, {title, genre, plot, cast})
        .then((movieFound) => {
            res.redirect(`/movies/${id}`)
        })
        .catch((err) => next(err))
})

module.exports = router;

/* Movie.findById(id)
.populate('cast')
.then((movieFound) => {
   res.render('movies/edit-movie', {movie: movieFound})
   Celebrity.find()
    .then((celebrities) => res.render('movies/edit-movie', celebrities))
})
.catch((err) => next(err)) */