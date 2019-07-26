function draw(rects, startNode) {
    // convert recursive structure to list of points
    var listPoints = node => {
        list = [{
            x: node.x,
            y: node.y,
            width: 5,
            height: 5,
        }]
        node.childNodes.forEach(child => {
            list = list.concat(listPoints(child))
        });
        return list
    }
    
    rects = rects.concat(listPoints(startNode))

    console.log(startNode)
    
    // draw objects
    sceneObjects = []
    sceneObjects = rects.map(rect => {
        var newRect = two.makeRectangle(
            rect.x, 
            rect.y, 
            rect.width, 
            rect.height);
        newRect.fill = rect.color || 'rgb(0, 200, 255)';
        newRect.opacity = 0.75;
        newRect.noStroke();
        return newRect;
    })

    // group objects, transform scene, flip y axis
    sceneGroup = two.makeGroup(sceneObjects);
    sceneGroup.translation = new Two.Vector(screenWidth/2, screenHeight);
    sceneGroup._matrix.manual = true;
    sceneGroup._matrix
        .identity()
        .translate(sceneGroup.translation.x, sceneGroup.translation.y)
        .rotate(sceneGroup.rotation)
        .scale(1, -1);

    two.update();   
}



jointList = []

function paint(tree) {
    var sceneObjects = []
    tree.remainingTargets.forEach(target => {
        const newCircle = two.makeCircle(
            target.x, 
            target.y, 
            captureRadius, 
        );
        newCircle.fill = 'rgb(255, 210, 220)';
        newCircle.opacity = .5;
        newCircle.noStroke();
        sceneObjects.push(newCircle);
    })

    jointList.forEach(joint => {
        if (!joint.parentJoint) return;
        
        var newLine = two.makeLine(joint.parentJoint.x, joint.parentJoint.y, joint.x, joint.y)
        newLine.linewidth = 3;
        newLine.stroke = 'rgb(80, 120, 40)';
        newLine.opacity = 1;
        sceneObjects.push(newLine);
    })

    // group objects, transform scene, flip y axis
    var sceneGroup = two.makeGroup(sceneObjects);
    sceneGroup.translation = new Two.Vector(screenWidth/2, screenHeight);
    sceneGroup._matrix.manual = true;
    sceneGroup._matrix
        .identity()
        .translate(sceneGroup.translation.x, sceneGroup.translation.y)
        .rotate(sceneGroup.rotation)
        .scale(1, -1);
}

function animate(tree) {
    //grow tree
    const newJoint = tree.grow();
    if (newJoint) {
        jointList.push(newJoint);
    }

    requestAnimationFrame( () => animate(tree) );
    two.clear();
    paint(tree);
    two.update();
};
