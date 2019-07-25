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