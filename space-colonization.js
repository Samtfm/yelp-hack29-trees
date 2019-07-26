// A note on terminology:
// `Node` is the generalized term for all points
// `Target` is a Node representing the resource points towards which the tree joints are growing
//    - Although these also have `parent` property, they won't actually have a parent
// `Joint` is a Node representing points on the tree which are growing towards targets
class Node{ 
    constructor(x, y, parent){
        this.x = x;
        this.y = y;
        this.parentJoint = parent;
        this.closestDist = Number.MAX_VALUE;
        this.closestJoint = parent;
        if(this.parentJoint != null){
            this.parentJoint.childNodes.push(this);
        }
        this.childNodes = [];
    }

    distance(node){
        return Math.sqrt((node.x-this.x)**2+(node.y-this.y)**2);
    }

    parentDistance(){
        return this.parentJoint ? this.distance(this.parentJoint) : 4;
    }
}

function _getPullVector(joint, targets) {
    vector = {dx:0, dy:0}
    targets.forEach(target => {
        dist = joint.distance(target)
        vector.dx += (target.x - joint.x)/(dist*dist)
        vector.dy += (target.y - joint.y)/(dist*dist)
    });
    return vector;
}

function generateChildJoint(joint, targets, branchLength) {
    pullVector = _getPullVector(joint, targets);
    magnitude = Math.sqrt((pullVector.dx)**2 + (pullVector.dy**2));
    normalizedVector = {
        dx: (pullVector.dx / magnitude) * branchLength,
        dy: (pullVector.dy / magnitude) * branchLength,
    }
    point = { x: joint.x + normalizedVector.dx, y: joint.y + normalizedVector.dy };
    return new Node(point.x, point.y, joint);
}

function getInfluencingTargets(joint, targets){
    influencingTargets = [];
    targets.forEach(target => {
        if(target.closestJoint === joint){
            influencingTargets.push(target);
        }
    });
    return influencingTargets;
}

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059
// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function TargetSort(a, b){
    return a.closestDist - b.closestDist;
}

/**
 * Implements space colonization algorithm for procedurally generating trees.
 * Returns: startJoint. Null if preconditions violated.
 * 
 * @param {Node[]} targets: Array of Nodes that form the scaffold for the colonization algorithm.
 * @param {Node} startJoint: Start location for the base of the tree.
 * @param {number} captureRadius: Distance from a joint to a target to consider the target "captured"
 * @param {number} branchLength: Distance between joints
 */
class Tree{
    constructor(targets, startJoint, captureRadius, branchLength, numJoints){
        // this.targets = targets
        this.startJoint = startJoint
        this.captureRadius = captureRadius
        this.branchLength = branchLength
        this.numJoints = numJoints
        this.remainingTargets = targets.slice(0); // Clone the array to edit it.
        this.currentJoint = startJoint
        this.counter = 0
    }
    
    grow(){
        if (this.counter > this.numJoints) { 
            return null; 
        }

        // Update the closest target and associated distance in the array.
        this.remainingTargets.forEach(target => {
            const dist = target.distance(this.currentJoint);
            if(dist < target.closestDist){
                target.closestDist = dist;
                target.closestJoint = this.currentJoint;
            }
        });

        // Capture targets
        for(var i = 0;i<this.remainingTargets.length;i++){
            if(this.currentJoint.parentJoint === null) break;
            if(this.remainingTargets[i].closestDist <= this.captureRadius){
                this.remainingTargets.splice(i,1);
                i--;
            }
        }
        // Break if this.remainingTargets is empty.
        if(this.remainingTargets.length == 0){
            return null;
        }

        // Select a frontierJoint (a new growth we're adding to the tree) and list of influencingTargets, based on which joint is closest to a target.
        this.remainingTargets.sort(TargetSort);
        const closestTarget = this.remainingTargets[0];
        const frontierJoint = closestTarget.closestJoint;
        const influencingTargets = getInfluencingTargets(frontierJoint, this.remainingTargets)

        // place new joint!
        this.currentJoint = generateChildJoint(frontierJoint, influencingTargets, this.branchLength)
        this.counter++;
        return this.currentJoint;
    }
}