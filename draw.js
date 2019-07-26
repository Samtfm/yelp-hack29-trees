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

    tree.allJointsList.forEach((joint, i) => {
        if (!joint.parentJoint) return;
        
        var newLine = two.makeLine(joint.parentJoint.x, joint.parentJoint.y, joint.x, joint.y)
        newLine.linewidth = 3 + (tree.allJointsList.length - i)*.01;
        newLine.stroke = 'rgb(80, 120, 40)';
        newLine.opacity = 1;
        newLine.cap = 'round';
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
    tree.grow(10);

    requestAnimationFrame( () => animate(tree) );
    two.clear();
    paint(tree);
    two.update();
};
