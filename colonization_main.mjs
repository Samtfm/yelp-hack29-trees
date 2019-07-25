var height = 600;
var width = 800;
var trunk = 100;

function x1(d) {return d.x1;}
function y1(d) {return height - d.y1;}
function x2(d) {return d.x2;}
function y2(d) {return height - d.y2;}

var scaffolding = [];
var branches = [];
var points = 200;

for(var i = 0;i < points; i++){
    const x = Math.random();
    const y = Math.random();
    scaffolding.push(new Node(x*width, y*(height-trunk)+trunk, null)); // Forms a random rectangle but with one good trunk.
}

function generateBranches(startNode){
    const ret = [];
    startNode.childNodes.forEach(element => {
        ret.push({
            x1: element.x,
            y1: element.y,
            x2: startNode.x,
            y2: startNode.y,
        });
        ret.push(...generateBranches(element));
    });
    return ret;
}

function create() {
	d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', '3px');
}

function regenerate(initialise) {
    const startNode = new Node(width/2, 0, null);
    colonization(scaffolding, startNode, trunk, .9, .03, .3, 1);
    branches = generateBranches(startNode);
    create();
}

d3.selectAll('.regenerate')
	.on('click', regenerate);

regenerate(true);