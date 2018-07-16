function Queue() {
  this.q = [];
}

Queue.prototype.enq = function(elem) {
  return this.q.push(elem);
};

Queue.prototype.deq = function() {
  return this.q.shift();
};

Queue.prototype.empty = function() {
  for (var i = 0; i < this.q.length + 1; i++) this.q.pop();
};
Queue.prototype.len = function() {
  return this.q.length;
};

export default Queue;
