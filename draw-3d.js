function paint() {
    var sceneObjects = new THREE.Group();
    if (window.tree){
        // window.tree.remainingTargets.forEach(target => {
        //     const newCircle = two.makeCircle(
        //         target.x, 
        //         target.y, 
        //         captureRadius, 
        //     );
        //     newCircle.fill = 'rgb(255, 210, 220)';
        //     newCircle.opacity = .5;
        //     newCircle.noStroke();
        //     sceneObjects.push(newCircle);
        // });
        var cubeGeometry = new THREE.BoxGeometry( 1,1,1 );

        window.tree.allJointsList.forEach((joint, i) => {
            if (!joint.parentJoint) return;
            // console.log(joint, joint.parentJoint)

            // var geometry = new THREE.Geometry();
            // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

            // geometry.vertices.push(new THREE.Vector3( joint.parentJoint.x, joint.parentJoint.y, joint.parentJoint.z) );
            // geometry.vertices.push(new THREE.Vector3( joint.x, joint.y, joint.z) );
            // material.wireframe=true;
            // var newPart = new THREE.Line( geometry, material );

            var scale = .5 + (window.tree.allJointsList.length - i)*.007;
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            material.wireframe=true;
            var newPart = new THREE.Mesh( cubeGeometry, material )
            newPart.position.set(joint.x, joint.y, joint.z)
            newPart.scale.set(scale,scale,scale)
            sceneObjects.add( newPart );
        });
        if (window.tree.remainingTargets.size>1){

            window.tree.remainingTargets.forEach(target => {
                var material = new THREE.MeshBasicMaterial( { color: 0xff8888 } );
                material.wireframe=true;
                var newPart = new THREE.Mesh( cubeGeometry, material )
                newPart.position.set(target.x, target.y, target.z)
                sceneObjects.add( newPart );
            });
        }

    }

    // window.userGeneratedTargets.forEach(target => {
    //     const newCircle = two.makeCircle(
    //         target.x, 
    //         target.y, 
    //         captureRadius, 
    //     );
    //     newCircle.fill = 'rgb(255, 210, 220)';
    //     newCircle.opacity = .5;
    //     newCircle.noStroke();
    //     sceneObjects.push(newCircle);
    // });
    // sceneObjects.rotateOnAxis(upVector, .01)
    return sceneObjects;
}

function animate() {
    //grow tree
    if (window.tree) { window.tree.grow(10) };

    requestAnimationFrame( () => animate() );
    two.clear();
    paint();
    two.update();
};
