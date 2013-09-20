(function (views) {

	views.PaginationView = Backbone.View.extend({

		events: {
      'click a.filter': 'search',
			'click a.first': 'gotoFirst',
			'click a.prev': 'gotoPrev',
			'click a.next': 'gotoNext',
			'click a.last': 'gotoLast',
			'click a.page': 'gotoPage',
			'click .howmany a': 'changeCount',
			'click a.sortAsc': 'sortByAscending',
			'click a.sortDsc': 'sortByDescending',
		},

		tagName: 'aside',

		pagingTemplate: _.template($('#tmpClientPagination').html()),

		initialize: function () {
			this.collection.on('reset', this.render, this);
      
			this.$el.appendTo('#pagination');

		},

    search: function() {
      var that = this;
       this.collection.server_api.keywords = $('#filterString').val();
       this.collection.reset();
       this.collection.fetch({reset: false, success: function(model)  {
          $('aside').remove();
          app.collections.paginatedItems = new app.collections.PaginatedCollection(); 	
          app.views.app = new app.views.AppView({collection: app.collections.paginatedItems});
          app.views.pagination = new app.views.PaginationView({collection: app.collections.paginatedItems});
          that.render() 
          }}
                            )},
		render: function () {
			var html = this.pagingTemplate(this.collection.info());
      this.$el.html(html);
		},

		gotoFirst: function (e) {
			e.preventDefault();
			this.collection.goTo(1);
		},

		gotoPrev: function (e) {
			e.preventDefault();
			this.collection.previousPage();
		},

		gotoNext: function (e) {
			e.preventDefault();
			this.collection.nextPage();
		},

		gotoLast: function (e) {
			e.preventDefault();
			this.collection.goTo(this.collection.information.lastPage);
		},

		gotoPage: function (e) {
			e.preventDefault();
			var page = $(e.target).text();
			this.collection.goTo(page);
		},

		changeCount: function (e) {
			e.preventDefault();
			var per = $(e.target).text();
			this.collection.howManyPer(per);
		},

		sortByAscending: function (e) {
			e.preventDefault();
			var currentSort = this.getSortOption();
			this.collection.setSort(currentSort, 'asc');
			this.collection.pager();
			this.preserveSortOption(currentSort);
		},

		getSortOption: function () {
			return $('#sortByOption').val();
		},

		preserveSortOption: function (option) {
			$('#sortByOption').val(option);
		},

		sortByDescending: function (e) {
			e.preventDefault();
			var currentSort = this.getSortOption();
			this.collection.setSort(currentSort, 'desc');
			this.collection.pager();
			this.preserveSortOption(currentSort);
		},
        
		getFilterField: function () {
			return $('#filterByOption').val();
		},

		getFilterValue: function () {
			return $('#filterString').val();
		},

		preserveFilterField: function (field) {
			$('#filterByOption').val(field);
		},

		preserveFilterValue: function (value) {
			$('#filterString').val(value);
		},

		filter: function (e) {
			e.preventDefault();

			var fields = this.getFilterField();
			/*Note that this is an example! 
			 * You can create an array like 
			 * 
			 * fields = ['Name', 'Description', ...];
			 *
			 *Or an object with rules like
			 *
			 * fields = {
			 *				'Name': {cmp_method: 'levenshtein', max_distance: 7}, 
			 *				'Description': {cmp_method: 'regexp'},
			 *				'Rating': {} // This will default to 'regexp'
			 *			};
			 */

			var filter = this.getFilterValue();
			
			this.collection.setFilter(fields, filter);
			this.collection.pager();

			this.preserveFilterField(fields);
			this.preserveFilterValue(filter);
		}
	});
})( app.views );
