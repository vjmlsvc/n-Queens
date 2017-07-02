/*
X			generate population			X

X			test for fitness			X

X	discard bottom half of population	X

breed top half and add both children to population
*/

var dim = 8;

function main(population, generations) {
	var boards = [];
	var fitnesses = [];
	var result;
	for (var i = 0; i < population; i++) {
		boards.push(generate());
	}
	for (var j = 0; j < generations; j++) {
		for (var k = 0; k < boards.length; k++) {
			result = fitness(boards[k]);
			if (result === 0) console.log(j, boards[k]);
			fitnesses.push(result);
		}
		boards = cull(boards, fitnesses);
		fitnesses = []
		boards = breed(boards);
	}
}

function generate() {
	// returns random board where each queen has unique column
	var board = 0;
	for (var i = 0; i < dim; i++)
		board += Math.floor(Math.random() * dim) * Math.pow(10, i);
	return board;
}

function fitness(board) {
	// evaluates fitness of board state
	var fitness = 0;
	var current;
	var other;

	for (var i = 0; i < dim; i++) {
		current = Math.floor((board % Math.pow(10, dim - i)) / (Math.pow(10, dim - 1 - i)));
		for (var j = i + 1; j < dim; j++) {
			other = Math.floor((board % Math.pow(10, dim - j)) / (Math.pow(10, dim - 1 - j)));
			if (current === other || current + i === other + j || current - i === other - j)
				fitness--;
		}
	}
	return fitness;
}

function cull(boards, fitnesses) {
	var fittest = []
	var best;
	var half = fitnesses.length / 2;
	for (var j = 0; j < half; j++) {
		for (var i = 0; i < fitnesses.length; i++) {
			best ? fitnesses[i] > fitnesses[best] ? i : best : best = i;
		}
		fittest.push(boards[best]);
		boards.splice(best, 1);
		fitnesses.splice(best, 1);
	}
	return fittest;
}

function mutate(child) {
	child = child.toString().split("");
	var padding = [];
	for (var i = 0; i < dim - child.length; i++) {
		padding[i] = "0";
	}
	child = padding.concat(child);
	var gene = Math.floor(Math.random() * dim);
	var newValue = Math.floor(Math.random() * dim);
	child[gene] = newValue;
	return parseInt(child.join(""));
}

function mate(mom, dad) {
	var children = [];
	var intermix = Math.pow(10, Math.floor(Math.random() * (dim - 1) + 1));
	children[0] = Math.floor(dad / intermix) * intermix;
	children[0] += mom % intermix;
	children[1] = Math.floor(mom / intermix) * intermix;
	children[1] += dad % intermix;
	if (Math.floor(Math.random() * 1000000) === 0)
		children[0] = mutate(children[0]);
	return children;
}

function breed(boards) {
	var parents = boards.length;
	for (var i = 0; i < parents; i += 2) {
		boards.push(...mate(boards[i], boards[i + 1]));
	}
	return boards;
}

