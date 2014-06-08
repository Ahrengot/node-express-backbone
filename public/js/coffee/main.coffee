Movie = Backbone.Model.extend
	idAttribute: "_id"
	defaults:
		rating: 0
	initialize: ->
		if @has "rating"
			@set "rating", parseInt( @get( "rating" ) ), { silent: yes }

Movies = Backbone.Collection.extend
	url: "/api/movies"
	model: Movie

MovieView = Backbone.View.extend
	tagName: "li"
	className: "movie"
	template: _.template document.getElementById( "movie-tmpl" ).innerHTML
	events:
		"dblclick .movie-data": "edit"
		"submit form": "update"
		"click .delete": "delete"
	edit: ->
		@$el.addClass "editing"
		@$("input").first().focus()
	update: (e) ->
		e.preventDefault();
		@model.save $( e.target ).serializeObject()
	delete: ->
		@model.destroy() if confirm "Delete #{@model.get 'title'}?"
	render: ->
		html = @template @model.toJSON()
		@$el.html html
		@

MoviesView = Backbone.View.extend
	el: "#movies"
	events:
		"submit #add-movie": "addMovie"
	renderMovies: (movies) ->
		movieContainer = @$ ".movies"
		movieContainer.empty()

		if movies.length > 0
			# Reverse because we want 5-star ratings at the top of the list
			_.each movies.sortBy( "rating" ).reverse(), (model) ->
				movieContainer.append new MovieView( { model } ).render().el
		else
			movieContainer.html "<p class='text-muted lead'>You haven't added any movies yet&hellip; </p>"
	addMovie: (e) ->
		e.preventDefault();
		form = $ e.target
		Backbone.trigger 'add_movie', form.serializeObject()

		# Reset form and select first input
		form.find("input")
			.val("")
			.first()
			.focus()


# App controller
class App
	constructor: ->
		@movies = new Movies()
		@view = new MoviesView()

		@movies.on "change add remove", =>
			@view.renderMovies @movies

		Backbone.on "add_movie", (data) =>
			@movies.create data

		@movies.fetch
			success: =>
				@view.renderMovies @movies
				$(".add-movie-panel")
					.removeClass('loading')
					.find("input")
					.first()
					.focus()
			error: => alert "Unable to get movies data from URL #{@movies.url}"

window.app = new App()