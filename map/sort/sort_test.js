steal("can/map/sort", "can/test", "can/view/mustache", function () {
	module('can/map/sort');

	test('list events', 16, function () {
		var list = new can.List([{
			name: 'Justin'
		}, {
			name: 'Brian'
		}, {
			name: 'Austin'
		}, {
			name: 'Mihael'
		}]);
		list.comparator = 'name';
		list.sort();
		// events on a list
		// - move - item from one position to another
		//          due to changes in elements that change the sort order
		// - add (items added to a list)
		// - remove (items removed from a list)
		// - reset (all items removed from the list)
		// - change something happened
		// a move directly on this list
		list.bind('move', function (ev, item, newPos, oldPos) {
			ok(true, 'move called');
			equal(item.name, 'Zed');
			equal(newPos, 3);
			equal(oldPos, 0);
		});
		// a remove directly on this list
		list.bind('remove', function (ev, items, oldPos) {
			ok(true, 'remove called');
			equal(items.length, 1);
			equal(items[0].name, 'Alexis');
			equal(oldPos, 0, 'put in right spot');
		});
		list.bind('add', function (ev, items, newLength) {
			ok(true, 'add called');
			equal(items.length, 1);
			equal(items[0].name, 'Alexis');
			// .push returns the new length not the current position
			equal(newLength, 4, 'got new length');
		});
		list.push({
			name: 'Alexis'
		});
		// now lets remove alexis ...
		list.splice(0, 1);
		list[0].attr('name', 'Zed');
	});

	test('list sort with func', 1, function () {
		var list = new can.List([{
			priority: 4,
			name: 'low'
		}, {
			priority: 1,
			name: 'high'
		}, {
			priority: 2,
			name: 'middle'
		}, {
			priority: 3,
			name: 'mid'
		}]);
		list.sort(function (a, b) {
			// Sort functions always need to return the -1/0/1 integers
			if (a.priority < b.priority) {
				return -1;
			}
			return a.priority > b.priority ? 1 : 0;
		});
		equal(list[0].name, 'high');
	});

	test('list sort with comparator', 1, function () {
		var list = new can.List([{
			priority: 4,
			name: 'low'
		}, {
			priority: 1,
			name: 'high'
		}, {
			priority: 2,
			name: 'middle'
		}, {
			priority: 3,
			name: 'mid'
		}]);
		list.comparator = 'priority';
		list.sort();
		equal(list[0].name, 'high');
	});

	test('list sort with containing Map attribute', 4, function () {
		var list = new can.Map.List([
			new can.Map({
				text: 'Bbb',
				func: can.compute(function () {
					return 'bbb';
				})
			}),
			new can.Map({
				text: 'abb',
				func: can.compute(function () {
					return 'abb';
				})
			}),
			new can.Map({
				text: 'Aaa',
				func: can.compute(function () {
					return 'aaa';
				})
			}),
			new can.Map({
				text: 'baa',
				func: can.compute(function () {
					return 'baa';
				})
			})
		]);
		list.comparator = 'func';
		list.sort();
		equal(list.attr()[0].text, 'Aaa');
		equal(list.attr()[1].text, 'abb');
		equal(list.attr()[2].text, 'baa');
		equal(list.attr()[3].text, 'Bbb');
	});

	test('Render pushed item at correct index', function () {

		var renderer =
			can.view.mustache('<ul>{{#items}}<li>{{id}}</li>{{/items}}</ul>');
		var el = document.createElement('div');

		var items = new can.List([{
			id: 'b'
		}]);
		items.comparator = 'id';

		// Render the template and place inside the <div>
		el.appendChild(renderer({
			items: items
		}));

		var firstElText = el.getElementsByTagName('li')[0].innerText;

		/// Check that the template rendered an item
		equal(firstElText, 'b',
			'First LI is a "b"');

		// Add another item
		items.push({
			id: 'a'
		});

		// Get the text of the first <li> in the <div>
		firstElText = el.getElementsByTagName('li')[0].innerText;

		// Check that the template rendered that item at the correct index
		equal(firstElText, 'a',
			'An item pushed into the list is rendered at the correct position');

	});

	test('Render unshifted item at correct index', function () {

		var renderer =
			can.view.mustache('<ul>{{#items}}<li>{{id}}</li>{{/items}}</ul>');
		var el = document.createElement('div');

		var items = new can.List([{
			id: 'a'
		}]);
		items.comparator = 'id';

		// Render the template and place inside the <div>
		el.appendChild(renderer({
			items: items
		}));

		var firstElText = el.getElementsByTagName('li')[0].innerText;

		/// Check that the template rendered an item
		equal(firstElText, 'a',
			'First LI is a "a"');

		// Add another item
		items.unshift({
			id: 'b'
		});

		// Get the text of the first <li> in the <div>
		firstElText = el.getElementsByTagName('li')[1].innerText;

		// Check that the template rendered that item at the correct index
		equal(firstElText, 'b',
			'An item unshifted into the list is rendered at the correct position');

	});

	test('Render spliced item at correct index', function () {

		var renderer =
			can.view.mustache('<ul>{{#items}}<li>{{id}}</li>{{/items}}</ul>');
		var el = document.createElement('div');

		var items = new can.List([
			{ id: 'b' },
			{ id: 'c' }
		]);
		items.comparator = 'id';

		// Render the template and place inside the <div>
		el.appendChild(renderer({
			items: items
		}));

		var firstElText = el.getElementsByTagName('li')[0].innerText;

		// Check that the "b" is at the beginning of the list
		equal(firstElText, 'b',
			'First LI is a b');

		// Add a "1" to the middle of the list
		items.splice(1, 0, {
			id: 'a'
		});

		// Get the text of the first <li> in the <div>
		firstElText = el.getElementsByTagName('li')[0].innerText;

		// Check that the "a" was added to the beginning of the list despite
		// the splice
		equal(firstElText, 'a',
			'An item spliced into the list at the wrong position is rendered ' +
			'at the correct position');

	});

	test('Fires "move" event on property change', 2, function () {

		var items = new can.List([
			{ id: 'x' },
			{ id: 'y' },
			{ id: 'z' }
		]);
		items.comparator = 'id';
		items.bind('move', function (ev, item, newPos, oldPos) {
			if (oldPos === 2 && newPos === 0) {
				ok(true, 'Last item moved to the beginnning of the list');
			}
		});

		// Change the ID of the last item to be lower than the first item
		items.attr('2').attr('id', 'a');
		equal(items.attr('0').attr('id'), 'a', 'First item is an "a"');
	});
});
