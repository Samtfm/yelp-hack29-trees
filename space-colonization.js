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
 * @param {number} startDist: Mean branch length for the trunk.
 * @param {number} scaling: Scaling factor for branch length. Must be 0 < x <= 1.
 * @param {number} noise: Branch length is a normal sample with mean branch length and std dev noise*length. Thus noise x >= 0 and should probably be <= .25.
 * @param {number} captureFraction: Fraction of previous branch necessary to capture targets points. 0 < x < scaling
 * @param {number} minBranchLength: Smallest length a branch can be to avoid infinite sum boundary.
 */
function colonization(targets, startJoint, startDist, scaling, noise, captureFraction, minBranchLength){
    // Check that pre-conditions are met.
    if(scaling <= 0 || scaling > 1){
        return null;
    }
    if(captureFraction <=0 || captureFraction >= scaling) return null;
    if(noise < 0) return null;


    let remainingTargets = targets.slice(0); // Clone the array to edit it.
    let currentJoint = startJoint;
    var counter = 0;
    while(counter < 1000){ //Hard cutoff on tree size.
        // Update the closest target and associated distance in the array.
        remainingTargets.forEach(target => {
            const dist = target.distance(currentJoint);
            if(dist < target.closestDist){
                target.closestDist = dist;
                target.closestJoint = currentJoint;
            }
        });

        // Capture targets
        for(var i = 0;i<remainingTargets.length;i++){
            if(currentJoint.parentJoint === null) break;
            if(remainingTargets[i].closestDist <= currentJoint.parentDistance() * captureFraction){
                remainingTargets.splice(i,1);
                i--;
            }
        }

        // Break if remainingTargets is empty.
        if(remainingTargets.length == 0){
            break;
        }

        // Select a frontierJoint (a new growth we're adding to the tree) and list of influencingTargets, based on which joint is closest to a target.
        remainingTargets.sort(TargetSort);
        const closestTarget = remainingTargets[0];
        const frontierJoint = closestTarget.closestJoint;
        const influencingTargets = getInfluencingTargets(frontierJoint, remainingTargets)

        // update branch length
        var branchLength = (frontierJoint.parentJoint === null)
            ? startDist
            : Math.max(frontierJoint.parentDistance() * scaling * (1 + noise*randn_bm()), minBranchLength);

        // place new joint!
        currentJoint = generateChildJoint(frontierJoint, influencingTargets, branchLength)
        counter++;
    }
    return startJoint;
}