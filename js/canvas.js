var KineticStage,
    arrBoundWrap = [];
function initCanvas(ks){
    KineticStage = ks;
}
function drawImage(imageObj, x, y, w, h, zindex, isdrap) {
    var layer = new Kinetic.Layer();
    var img;
    var isTouch = $('html').hasClass('isMobile');
    if (isdrap) {
        img = new Kinetic.Image({
            image: imageObj,
            x: 0,
            y: 0,
            width: w,
            height: h,
            name: 'image'
        });

        var characterGroup = new Kinetic.Group({
            x: x,
            y: y,
            draggable: true
        });

        layer.add(characterGroup);
        KineticStage.add(layer);
        characterGroup.add(img);
        if (zindex) characterGroup.setZIndex(zindex);
        addAnchor(characterGroup, -60, -60, 'topLeft', 'none');
        addAnchor(characterGroup, (w), -60, 'topRight', 'none');
        addAnchor(characterGroup, (w), (h), 'bottomRight', 'none');
        addAnchor(characterGroup, -60, (h), 'bottomLeft', 'none');
        addWrapLine(characterGroup);

        var rotateAnchor = addAnchor(characterGroup, (w + 60),-60, 'rotateAnchor', 'rotate');
        var wrapline = [],
            arrChildren = characterGroup.children;
        for (var i = 0, len = arrChildren.length; i < len; i++) {
            var children = arrChildren[i];
            //console.log(children.getName());
            if (children.getName() !== 'image') {
                wrapline.push(children);
                arrBoundWrap.push(children);
            }
        }
        //console.log(arrBoundWrap);
        //Default hide all wrap line
        for (var i = 0, len = wrapline.length; i < len; i++) {
            var obj = wrapline[i];
            obj.hide();
        }
        //display red cicrle
        rotateAnchor.show();

        if(!isTouch){
            img.on('mouseover', function() {
                document.body.style.cursor = 'pointer';
            });
            img.on('mouseout', function() {
                document.body.style.cursor = 'default';
                isDown = false
            });
            rotateAnchor.on('dragstart', function() {
                hideWrap(function() {
                    for (var i = 0, len = wrapline.length; i < len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if ((i == len - 1)) KineticStage.draw();
                    }
                });
            });
            characterGroup.on('dragend', function() {
                hideWrap(function() {
                    for (var i = 0, len = wrapline.length; i < len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if ((i == len - 1)) KineticStage.draw();
                    }
                });
                this.opacity(1);
                this.parent.setZIndex(zindex);
            });
            KineticStage.addEventListener('mouseout mouseleave', function(e) {
                //characterGroup.parent.setZIndex(zindex);
                //quix fix only
                characterGroup.parent.moveToBottom();
                //characterGroup.opacity(1);
            });
            KineticStage.addEventListener('mouseover', function(e) {
                //console.log('mouseover');
                characterGroup.parent.moveToTop();
            });
        }else{
            characterGroup.on('touchstart dragstart', function (e) {
                this.moveToTop();
                hideWrap(function(){
                    for (var i = 0,len=wrapline.length;i<len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if((i==len-1))KineticStage.draw();
                    }
                });
                //console.log(e);
            });
            img.on('touchstart', function (e) {
                hideWrap(function(){
                    for (var i = 0,len=wrapline.length;i<len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if((i==len-1))KineticStage.draw();
                    }
                });
            });
            rotateAnchor.on('touchstart', function () {
                hideWrap(function(){
                    for (var i = 0,len=wrapline.length;i<len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if((i==len-1))KineticStage.draw();
                    }
                });
            });
            characterGroup.on('dragend', function () {
                hideWrap(function(){
                    for (var i = 0,len=wrapline.length;i<len; i++) {
                        var obj = wrapline[i];
                        obj.show();
                        if((i==len-1))KineticStage.draw();
                    }
                });
                characterGroup.parent.moveToBottom();
                //this.opacity(1);
                //this.parent.setZIndex(zindex);
            });
            KineticStage.addEventListener('touchend', function (e) {
            });
            KineticStage.addEventListener('touchstart', function (e) {
                //console.log(characterGroup.parent);
                characterGroup.parent.moveToTop();

            });
        }
        KineticStage.draw();
        return characterGroup;
    } else {
        img = new Kinetic.Image({
            image: imageObj,
            x: x,
            y: y,
            width: w,
            height: h,
            draggable: isdrap,
            name: 'image'
        });

        layer.add(img);
        if (zindex) img.setZIndex(zindex);
        KineticStage.add(layer);
        KineticStage.draw();
        return img;
    }
}

function drawText(textObj,zindex,isdrap){
    var layer = new Kinetic.Layer();
    var text;
    if (isdrap) {
        text = new Kinetic.Text({
            x: 0,
            y: 0,
            text: textObj.text,
            fontSize: textObj.fontSize,
            fontFamily: textObj.fontFamily,
            fill: textObj.color,
            name:'text',
            lineHeight:1.4
        });

        
        var characterGroup = new Kinetic.Group({
            x: textObj.x,
            y: textObj.y,
            draggable: true
        });

        //console.log(textObj);
        layer.add(characterGroup);
        if (zindex) characterGroup.setZIndex(zindex);
        KineticStage.add(layer);
        characterGroup.add(text);

        if(textObj.align=='center')text.setAlign(textObj.align);
        var h,w;
        w=text.getTextWidth();
        h=text.getHeight();
        if(textObj.align=='force-center'){
            characterGroup.attrs.x = textObj.x+(400*ratio-w)/2;
        }

        addAnchor(characterGroup, -12, -12, 'topLeft', 'none');
        addAnchor(characterGroup, (w), -12, 'topRight', 'none');
        addAnchor(characterGroup, (w), (h), 'bottomRight', 'none');
        addAnchor(characterGroup, -12, (h), 'bottomLeft', 'none');
        addWrapLine(characterGroup);
        var rotateAnchor = addAnchor(characterGroup, (w + 50), 0, 'rotateAnchor', 'rotate');
        var wrapline=[], arrChildren = characterGroup.children;
        for (var i = 0; i < arrChildren.length; i++) {
            var children = arrChildren[i];
            if(children.getName()!=='text'){
                wrapline.push(children);
                arrBoundWrap.push(children);
            }
        }
        //Default hide all wrap line
        for (var i = 0,len=wrapline.length;i<len; i++) {
            var obj = wrapline[i];
            obj.hide();
        }
        //display red cicrle
        rotateAnchor.show();
        text.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        text.on('mouseout', function () {
            document.body.style.cursor = 'default';
            isDown = false;
        });
        /*text.on('dblclick',function(){
            if(textObj.hashtag==0)updateText(text);
        });*/
        characterGroup.on('click dragstart', function () {
            this.moveToTop();
            hideWrap(function(){
                for (var i = 0,len=wrapline.length;i<len; i++) {
                    var obj = wrapline[i];
                    obj.show();
                    if((i==len-1))KineticStage.draw();
                }
            });
        });
        rotateAnchor.on('dragstart', function () {
            hideWrap(function(){
                for (var i = 0,len=wrapline.length;i<len; i++) {
                    var obj = wrapline[i];
                    obj.show();
                    if((i==len-1))KineticStage.draw();
                }
            });
        });
        characterGroup.on('dragend', function () {
            hideWrap(function(){
                for (var i = 0,len=wrapline.length;i<len; i++) {
                    var obj = wrapline[i];
                    obj.show();
                    if((i==len-1))KineticStage.draw();
                }
            });
            this.opacity(1);
            this.parent.setZIndex(zindex);
        });

        KineticStage.addEventListener('mouseout mouseleave', function (e) {
            characterGroup.parent.setZIndex(zindex);
            characterGroup.parent.opacity(1);
        });
        KineticStage.addEventListener('mouseover', function (e) {
            characterGroup.parent.moveToTop();
        });
        KineticStage.draw();
        return characterGroup;
    } else {
        text = new Kinetic.Text({
            x: 0,
            y: 0,
            text: textObj.text,
            fontSize: textObj.fontSize,
            fontFamily: textObj.fontFamily,
            fill: textObj.color,
        });
        text.setAlign(textObj.align);
        var characterGroup = new Kinetic.Group({
            x: textObj.x,
            y: textObj.y,
            draggable: false
        });
        layer.add(characterGroup);
        if (zindex) characterGroup.setZIndex(zindex);
        KineticStage.add(layer);
        characterGroup.add(text);
        KineticStage.draw();
        return text;
    }
}

function updateWrapText(obj){
    var characterGroup = obj.parent;        
    var h,w;
    w=obj.getTextWidth();
    h=obj.getHeight();
    
    var wrapline=[], arrChildren = characterGroup.children;
    for (var i = 0; i < arrChildren.length; i++) {
        var children = arrChildren[i];
        if(children.getName()!=='text'){
            children.remove();
            i--;
        }
    }
    addAnchor(characterGroup, -12, -12, 'topLeft', 'none');
    addAnchor(characterGroup, (w), -12, 'topRight', 'none');
    addAnchor(characterGroup, (w), (h), 'bottomRight', 'none');
    addAnchor(characterGroup, -12, (h), 'bottomLeft', 'none');
    addWrapLine(characterGroup);
    addAnchor(characterGroup, (w + 25), 0, 'rotateAnchor', 'rotate');
    for (var i = 0; i < arrChildren.length; i++) {
        var children = arrChildren[i];
        if(children.getName()!=='text'){
            wrapline.push(children);
            arrBoundWrap.push(children);
        }
    }
    KineticStage.draw();
    return characterGroup;
}

function hideWrap(callback) {
    //console.log(arrBoundWrap);
    for (var i = 0, len = arrBoundWrap.length; i < len; i++) {
        var obj = arrBoundWrap[i];
        //if($.isFunction(obj.hide))obj.hide();
        obj.hide();
        if (i == (len - 1)) {
            if ($.isFunction(callback)) callback();
        }
    }
}
//Clear all
function clearAllStage() {
    KineticStage = new Kinetic.Stage({
        container: "savestage",
        width: savew,
        height: saveh
    });
    return true;
}

function base64_tofield() {
    return $.scriptcam.getFrameAsBase64()
}

function base64_toimage() {
    $('#imgCapture').attr("src", "data:image/png;base64," + $.scriptcam.getFrameAsBase64())
}

function base64_tofield_and_image(b64) {}

function changeCamera() {}

function onError(errorId, errorMsg) {
    alert(errorMsg)
}

function onWebcamReady(cameraNames, camera, microphoneNames, microphone, volume) {}

function update(activeAnchor) {
    var group = activeAnchor.getParent(),
        topLeft = group.get('.topLeft')[0],
        topRight = group.get('.topRight')[0],
        bottomRight = group.get('.bottomRight')[0],
        bottomLeft = group.get('.bottomLeft')[0],
        rotateAnchor = group.get('.rotateAnchor')[0],
        image = group.get('Image')[0],
        text = group.get('Text')[0],
        anchorX = activeAnchor.getX(),
        anchorY = activeAnchor.getY(),
        imageWidth = 0,
        imageHeight = 0,
        textFontSize = 0,
        textWidth = 0,
        textHeight = 0,
        offsetX = Math.abs((topLeft.getX() + bottomRight.getX() + 30) / 2),
        offsetY = Math.abs((topLeft.getY() + bottomRight.getY() + 30) / 2);
    if (image !== undefined) {
        imageWidth = image.getWidth();
        imageHeight = image.getHeight();
    }
    if (text !== undefined) {
        textFontSize = text.getFontSize();
        textWidth = text.getTextWidth();
        textHeight = text.getHeight();
    }
    switch (activeAnchor.getName()) {
        case 'rotateAnchor':
            break;
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            topRight.setX(anchorX);
            bottomLeft.setY(anchorY);
            break;
        case 'bottomLeft':
            topLeft.setX(anchorX);
            bottomRight.setY(anchorY);
            break
    }
    rotateAnchor.setX(topRight.getX()+60);
    rotateAnchor.setY(topRight.getY());
    if (image !== undefined) {
        image.setAttrs({
            'x': (topLeft.getPosition().x + 60),
            'y': (topLeft.getPosition().y + 60)
        });
    }
    if (text !== undefined) {
        text.setAttrs({
            'x': (topLeft.getPosition().x + 36),
            'y': (topLeft.getPosition().y + 36)
        });
    }
    var width = topRight.getX() - topLeft.getX() - 60;
    var height = bottomLeft.getY() - topLeft.getY() - 60;
    if (width && height && image !== undefined) {
        image.setSize({
            width: width,
            height: height
        })
    }
    if (text !== undefined) {
        if (width < textWidth) {
            text.setFontSize(text.getFontSize() - 1);
        } else {
            text.setFontSize(text.getFontSize() + 1);
        }
    }
}

function addAnchor(group, x, y, name, dragBound) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor;
    if (dragBound == 'rotate') {
        anchor = new Kinetic.Circle({
            x: x,
            y: y,
            stroke: '#ff0000',
            strokeWidth: 4,
            radius: 28,
            name: name,
            draggable: true,
            dragOnTop: false
        });
        anchor.setAttrs({
            dragBoundFunc: function(pos) {
                return getRotatingAnchorBounds(pos, group)
            }
        })
    } else {
        anchor = new Kinetic.Rect({
            x: x,
            y: y,
            width: 60,
            height: 60,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 1,
            name: name,
            draggable: true,
            dragOnTop: false
        });
    }
    anchor.on('dragmove', function() {
        update(this);
        updateline(group);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop()
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw()
    });
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(2);
        this.setStroke('#ff0000');
        layer.draw()
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(1);
        this.setStroke('#dddddd');
        layer.draw()
    });
    group.add(anchor);
    return anchor;
}

function addWrapLine(group) {
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var linetop = new Kinetic.Line({
        points: [topLeft.getX() + topLeft.getWidth() / 2, topLeft.getY() + topLeft.getHeight() / 2, topRight.getX() + topRight.getWidth() / 2, topRight.getY() + topRight.getHeight() / 2],
        stroke: '#666',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 2],
        name: 'linetop'
    });
    var lineright = new Kinetic.Line({
        points: [topRight.getX() + topRight.getWidth() / 2, topRight.getY() + topRight.getHeight() / 2, bottomRight.getX() + bottomRight.getWidth() / 2, bottomRight.getY() + bottomRight.getHeight() / 2],
        stroke: '#666',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 2],
        name: 'lineright'
    });
    var linebottom = new Kinetic.Line({
        points: [bottomRight.getX() + bottomRight.getWidth() / 2, bottomRight.getY() + bottomRight.getHeight() / 2, bottomLeft.getX() + bottomLeft.getWidth() / 2, bottomLeft.getY() + bottomLeft.getHeight() / 2],
        stroke: '#666',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 2],
        name: 'linebottom'
    });
    var lineleft = new Kinetic.Line({
        points: [bottomLeft.getX() + bottomLeft.getWidth() / 2, bottomLeft.getY() + bottomLeft.getHeight() / 2, topLeft.getX() + topLeft.getWidth() / 2, topLeft.getY() + topLeft.getHeight() / 2],
        stroke: '#666',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 2],
        name: 'lineleft'
    });
    group.add(linetop).add(lineright).add(linebottom).add(lineleft);
    return group;
}

function updateline(group) {
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var linetop = group.get('.linetop')[0];
    var lineright = group.get('.lineright')[0];
    var linebottom = group.get('.linebottom')[0];
    var lineleft = group.get('.lineleft')[0];
    linetop.setPoints([topLeft.getX() + topLeft.getWidth() / 2, topLeft.getY() + topLeft.getHeight() / 2, topRight.getX() + topRight.getWidth() / 2, topRight.getY() + topRight.getHeight() / 2]);
    lineright.setPoints([topRight.getX() + topRight.getWidth() / 2, topRight.getY() + topRight.getHeight() / 2, bottomRight.getX() + bottomRight.getWidth() / 2, bottomRight.getY() + bottomRight.getHeight() / 2]);
    linebottom.setPoints([bottomRight.getX() + bottomRight.getWidth() / 2, bottomRight.getY() + bottomRight.getHeight() / 2, bottomLeft.getX() + bottomLeft.getWidth() / 2, bottomLeft.getY() + bottomLeft.getHeight() / 2]);
    lineleft.setPoints([bottomLeft.getX() + bottomLeft.getWidth() / 2, bottomLeft.getY() + bottomLeft.getHeight() / 2, topLeft.getX() + topLeft.getWidth() / 2, topLeft.getY() + topLeft.getHeight() / 2])
}

function getRotatingAnchorBounds(pos, group) {
    var topLeft = group.get('.topLeft')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var topRight = group.get('.topRight')[0];
    var absCenterX = Math.abs((topLeft.getAbsolutePosition().x + 15 + bottomRight.getAbsolutePosition().x + 15) / 2);
    var absCenterY = Math.abs((topLeft.getAbsolutePosition().y + 15 + bottomRight.getAbsolutePosition().y + 15) / 2);
    var relCenterX = Math.abs((topLeft.getX() + bottomRight.getX()) / 2);
    var relCenterY = Math.abs((topLeft.getY() + bottomRight.getY()) / 2);
    var radius = distance(relCenterX, relCenterY, topRight.getX() + 15, topRight.getY() + 60);
    var scale = radius / distance(pos.x, pos.y, absCenterX, absCenterY);
    var realRotation = Math.round(degrees(angle(relCenterX, relCenterY, topRight.getX() + 15, topRight.getY() + 60)));
    var rotation = Math.round(degrees(angle(absCenterX, absCenterY, pos.x, pos.y)));
    rotation -= realRotation;
    group.setRotationDeg(rotation);
    return {
        y: Math.round((pos.y - absCenterY) * scale + absCenterY),
        x: Math.round((pos.x - absCenterX) * scale + absCenterX)
    }
}

function radians(degrees) {
    return degrees * (Math.PI / 180)
}

function degrees(radians) {
    return radians * (180 / Math.PI)
}

function angle(cx, cy, px, py) {
    var x = cx - px;
    var y = cy - py;
    return Math.atan2(-y, -x)
}

function distance(p1x, p1y, p2x, p2y) {
    return Math.sqrt(Math.pow((p2x - p1x), 2) + Math.pow((p2y - p1y), 2))
}