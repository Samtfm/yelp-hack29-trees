class Node{
    constructor(x, y, parent){
        this.x = x;
        this.y = y;
        this.parentNode = parent;
        this.closestDist = Number.MAX_VALUE;
        this.closestNode = parent;
        if(this.parentNode != null){
            this.parentNode.childNodes.push(this);
        }
        this.childNodes = [];
    }

    distance(node){
        return Math.sqrt((node.x-this.x)**2+(node.y-this.y)**2);
    }

    parentDistance(){
        return this.parentNode ? this.distance(this.parentNode) : 4;
    }
}

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059
// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function NodeSort(a, b){
    return a.closestDist - b.closestDist;
}

/**
 * Implements space colonization algorithm for procedurally generating trees.
 * Returns: startNode. Null if preconditions violated.
 * 
 * @param {Node[]} scaffolding: Array of Nodes that form the scaffold for the colonization algorithm.
 * @param {Node} startNode: Start location for the base of the tree.
 * @param {number} startDist: Mean branch length for the trunk.
 * @param {number} scaling: Scaling factor for branch length. Must be 0 < x <= 1.
 * @param {number} noise: Branch length is a normal sample with mean branch length and std dev noise*length. Thus noise x >= 0 and should probably be <= .25.
 * @param {number} captureFraction: Fraction of previous branch necessary to capture scaffolding points. 0 < x < scaling
 * @param {number} minBranchLength: Smallest length a branch can be to avoid infinite sum boundary.
 */
function colonization(scaffolding, startNode, startDist, scaling, noise, captureFraction, minBranchLength){
    // Check that pre-conditions are met.
    if(scaling <= 0 || scaling > 1){
        return null;
    }
    if(captureFraction <=0 || captureFraction >= scaling) return null;
    if(noise < 0) return null;

    let remaining = scaffolding.slice(0); // Clone the array to edit it.
    let newNode = startNode;
    var counter = 0;
    while(counter < 1000){ //Hard cutoff on tree size.
        // Update the closest node and associated distance in the array.
        remaining.forEach(element => {
            const dist = element.distance(newNode);
            if(dist < element.closestDist){
                element.closestDist = dist;
                element.closestNode = newNode;
            }
        });

        // Capture nodes
        for(var i = 0;i<remaining.length;i++){
            if(newNode.parentNode === null) break;
            if(remaining[i].closestDist <= newNode.parentDistance() * captureFraction){
                remaining.splice(i,1);
                i--;
            }
        }

        // Break if remaining is empty.
        if(remaining.length == 0){
            break;
        }

        // Sort Nodes based on distance to closest node of tree.
        remaining.sort(NodeSort);

        
        const target = remaining[0];
        const connectingNode = target.closestNode;
        var branchLength = Math.max(connectingNode.parentDistance() * scaling * (1 + noise*randn_bm()), minBranchLength);
        if(connectingNode.parent === null) branchLength = startDist;
        const factor = branchLength/target.closestDist;
        const dx = (target.x - connectingNode.x) * factor;
        const dy = (target.y - connectingNode.y) * factor;
        newNode = new Node(connectingNode.x+dx, connectingNode.y + dy, connectingNode);
        counter++;
    }
    return startNode;

}