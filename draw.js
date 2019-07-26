function paint() {
    var sceneObjects = []
    if (window.tree){
        window.tree.remainingTargets.forEach(target => {
            const newCircle = two.makeCircle(
                target.x, 
                target.y, 
                captureRadius, 
            );
            newCircle.fill = 'rgb(255, 210, 220)';
            newCircle.opacity = .5;
            newCircle.noStroke();
            sceneObjects.push(newCircle);
        });

        window.tree.allJointsList.forEach((joint, i) => {
            if (!joint.parentJoint) return;
            
            var newLine = two.makeLine(joint.parentJoint.x, joint.parentJoint.y, joint.x, joint.y)
            newLine.linewidth = 3 + (window.tree.allJointsList.length - i)*.01;
            newLine.stroke = 'rgb(80, 120, 40)';
            newLine.opacity = 1;
            newLine.cap = 'round';
            sceneObjects.push(newLine);
        });
    }

    window.userGeneratedTargets.forEach(target => {
        const newCircle = two.makeCircle(
            target.x, 
            target.y, 
            captureRadius, 
        );
        newCircle.fill = 'rgb(255, 210, 220)';
        newCircle.opacity = .5;
        newCircle.noStroke();
        sceneObjects.push(newCircle);
    });

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

function animate() {
    //grow tree
    if (window.tree) { window.tree.grow(10) };

    requestAnimationFrame( () => animate() );
    two.clear();
    paint();
    two.update();
};
