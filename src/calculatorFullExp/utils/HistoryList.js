function HistoryList() {
	this.stateHistory = [];
}

HistoryList.prototype.pushHistory = function(
	stateHistory,
	oprStackHistory,
	postfixArrHistory
) {
	var lastIndex = this.stateHistory.length;
	this.stateHistory.push(stateHistory);
	console.log('last index is ' + lastIndex);
	console.log('last index element is ');
	console.log(this.stateHistory[lastIndex]);
};

HistoryList.prototype.dequeue = function() {
	return this.stateHistory.shift();
};

HistoryList.prototype.pop = function() {
	return this.stateHistory.shift();
};

HistoryList.prototype.empty = function() {
	while (this.stateHistory.length > 0) {
		this.stateHistory.pop();
	}
};
HistoryList.prototype.len = function() {
	return this.stateHistory.length;
};

export default HistoryList;
