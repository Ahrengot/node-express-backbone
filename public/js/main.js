(function() {
  var App, Movie, MovieView, Movies, MoviesView;

  Movie = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
      rating: 0
    },
    initialize: function() {
      if (this.has("rating")) {
        return this.set("rating", parseInt(this.get("rating")), {
          silent: true
        });
      }
    }
  });

  Movies = Backbone.Collection.extend({
    url: "/api/movies",
    model: Movie
  });

  MovieView = Backbone.View.extend({
    tagName: "li",
    className: "movie",
    template: _.template(document.getElementById("movie-tmpl").innerHTML),
    events: {
      "dblclick .movie-data": "edit",
      "submit form": "update",
      "click .delete": "delete"
    },
    edit: function() {
      this.$el.addClass("editing");
      return this.$("input").first().focus();
    },
    update: function(e) {
      e.preventDefault();
      return this.model.save($(e.target).serializeObject());
    },
    "delete": function() {
      if (confirm("Delete " + (this.model.get('title')) + "?")) {
        return this.model.destroy();
      }
    },
    render: function() {
      var html;
      html = this.template(this.model.toJSON());
      this.$el.html(html);
      return this;
    }
  });

  MoviesView = Backbone.View.extend({
    el: "#movies",
    events: {
      "submit #add-movie": "addMovie"
    },
    renderMovies: function(movies) {
      var movieContainer;
      movieContainer = this.$(".movies");
      movieContainer.empty();
      if (movies.length > 0) {
        return _.each(movies.sortBy("rating").reverse(), function(model) {
          return movieContainer.append(new MovieView({
            model: model
          }).render().el);
        });
      } else {
        return movieContainer.html("<p class='text-muted lead'>You haven't added any movies yet&hellip; </p>");
      }
    },
    addMovie: function(e) {
      var form;
      e.preventDefault();
      form = $(e.target);
      Backbone.trigger('add_movie', form.serializeObject());
      return form.find("input").val("").first().focus();
    }
  });

  App = (function() {
    function App() {
      this.movies = new Movies();
      this.view = new MoviesView();
      this.movies.on("change add remove", (function(_this) {
        return function() {
          return _this.view.renderMovies(_this.movies);
        };
      })(this));
      Backbone.on("add_movie", (function(_this) {
        return function(data) {
          return _this.movies.create(data);
        };
      })(this));
      this.movies.fetch({
        success: (function(_this) {
          return function() {
            _this.view.renderMovies(_this.movies);
            return $(".add-movie-panel").removeClass('loading').find("input").first().focus();
          };
        })(this),
        error: (function(_this) {
          return function() {
            return alert("Unable to get movies data from URL " + _this.movies.url);
          };
        })(this)
      });
    }

    return App;

  })();

  window.app = new App();

}).call(this);
