//dictionary constructor
function Dictionary(startValues) {
	this.values = startValues || {};
}

Dictionary.prototype.store = function(name, value) {
	this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
	return this.values[name];
};
Dictionary.prototype.contains = function(name) {
	return Object.prototype.hasOwnProperty.call(this.values, name) && Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
	for (var x in this.values) {
		if (this.values.hasOwnProperty(x)) {
			action(x, this.values[x]);
		}
	}
};


Dictionary.prototype.names = function() {
	var names = [];
	this.each(function(name, value) {
		names.push(name);
	});
	return names;
};

//returns values of the dictionary
Dictionary.prototype.values = function() {
	var values = [];
	this.each(function(name, value) {
		values.push(value);
	});
	return values;
};
