var distance = (a, b) => {
    return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
}

var getPullVector = (node, targets, travelDistance) => {
    vector = {x:0, y:0}
    var tooClose = false;
    targets.forEach(target => {
        dist = distance(node, target)
        if (dist < travelDistance) {
            target.active = false;
            tooClose = true;
        }
        if (target.active) {
            vector.x += (target.x - node.x)/(dist*dist)
            vector.y += (target.y - node.y)/(dist*dist)
        }
    });
    if (tooClose) {
        return null;
    }
    return vector
}   

var getPullPoint = (node, targets, travelDistance) => {
    vector = getPullVector(node, targets, travelDistance);
    if (!vector) {return null};
    magnitude = distance({x:0,y:0}, vector)
    normalizedVector = {
        x: (vector.x / magnitude) * travelDistance,
        y: (vector.y / magnitude) * travelDistance,
    }
    point = { x: node.x + normalizedVector.x, y: node.y + normalizedVector.y };
    return point
}

var assignTargets = (nodes, targets) => {
    assignments = []
    nodes.forEach(node => {
        assignments.push(
            {
                node: node,
                targets: []
            }
        )
    })
}