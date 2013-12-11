App.Views.App = Support.CompositeView.extend({

	templateName: 'app',
	
	initialize: function () {
	},

	render: function () {
		var html = this.buildTemplate({message: 'Threadfinder is currently down for a very brief maintenance. Check back in 10 minutes!'});
		this.$el.html(html);

		return this;
	}

});