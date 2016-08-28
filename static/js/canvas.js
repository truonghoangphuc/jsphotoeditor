var KineticStage,
    arrBoundWrap = [],
    currentObj,
    currentTextObj,
    currentKineticLayer=null;
function initCanvas(ks){
    KineticStage = ks;
}
function drawImage(imageObj, x, y, w, h, zindex, isdrap,ref) {
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
        //console.log(imageObj);
        if (zindex) layer.setZIndex(zindex);
        //console.log(zindex);
        addAnchor(characterGroup, -30, -30, 'topLeft', 'none');
        addAnchor(characterGroup, (w), -30, 'topRight', 'none');
        addAnchor(characterGroup, (w), (h), 'bottomRight', 'none');
        addAnchor(characterGroup, -30, (h), 'bottomLeft', 'none');
        addWrapLine(characterGroup);

        var rotateAnchor = addAnchor(characterGroup, (w + 25), 0, 'rotateAnchor', 'rotate');
        var wrapline = [],
            arrChildren = characterGroup.children;
        for (var i = 0, len = arrChildren.length; i < len; i++) {
            var children = arrChildren[i];
            if (children.getName() !== 'image') {
                wrapline.push(children);
                arrBoundWrap.push(children);
            }
        }

        //console.log(arrBoundWrap);
        layer.wrapline = wrapline;
        //Default hide all wrap line
        for (var i = 0, len = wrapline.length; i < len; i++) {
            var obj = wrapline[i];
            obj.hide();
        }
        //display red cicrle
        //rotateAnchor.show();


        if(ref!==undefined){
            characterGroup.ref = ref;
        }

        if(!isTouch){
            img.on('mouseover', function() {
                document.body.style.cursor = 'pointer';
            });
            img.on('mouseout', function() {
                document.body.style.cursor = 'default';
                isDown = false;
            });
            rotateAnchor.on('dragstart', function() {
                // hideWrap(function() {
                //     for (var i = 0, len = wrapline.length; i < len; i++) {
                //         var obj = wrapline[i];
                //         obj.show();
                //         if ((i == len - 1)) KineticStage.draw();
                //     }
                // });
            });
            characterGroup.on('click', function() {
                // hideWrap(function() {
                //     for (var i = 0, len = wrapline.length; i < len; i++) {
                //         var obj = wrapline[i];
                //         obj.show();
                //         if ((i == len - 1)) KineticStage.draw();
                //     }
                // });
            });
            characterGroup.on('dragend', function() {
                
            });
            KineticStage.addEventListener('mouseout mouseleave', function(e) {
                //if(this.parent!==undefined)characterGroup.parent.setZIndex(zindex);
                //characterGroup.opacity(1);
                //moveTop.hide();moveBottom.hide();
            });
            KineticStage.addEventListener('mouseover', function(e) {
                //if(this.parent!==undefined)characterGroup.parent.moveToTop();
            });
        }else{
            characterGroup.on('touchstart', function () {
                //this.moveToTop();
                // hideWrap(function(){
                //     for (var i = 0,len=wrapline.length;i<len; i++) {
                //         var obj = wrapline[i];
                //         obj.show();
                //         if((i==len-1))KineticStage.draw();
                //     }
                // });
                moveTop.show();moveBottom.show();
            });
            img.on('touchstart', function () {
                // hideWrap(function(){
                //     for (var i = 0,len=wrapline.length;i<len; i++) {
                //         var obj = wrapline[i];
                //         obj.show();
                //         if((i==len-1))KineticStage.draw();
                //     }
                // });
            });
            rotateAnchor.on('touchstart', function () {
                // hideWrap(function(){
                //     for (var i = 0,len=wrapline.length;i<len; i++) {
                //         var obj = wrapline[i];
                //         obj.show();
                //         if((i==len-1))KineticStage.draw();
                //     }
                // });
            });
            KineticStage.addEventListener('touchend', function (e) {
                //characterGroup.parent.setZIndex(zindex);
                //characterGroup.parent.opacity(1);
            });
            KineticStage.addEventListener('touchstart', function (e) {
                //console.log(characterGroup.parent);
                //characterGroup.parent.moveToTop();
            });
        }
        characterGroup.on('click touchstart', function(e) {
            currentObj = characterGroup;
            currentKineticLayer = layer;
        });

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
        img.on('click touchstart', function(e) {
            currentObj = img;
            currentKineticLayer = layer;
        });
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
            align:textObj.align
        });

        var characterGroup = new Kinetic.Group({
            x: textObj.x,
            y: textObj.y,
            draggable: true
        });
        //console.log(textObj);
        layer.add(characterGroup);
        KineticStage.add(layer);
        characterGroup.add(text);
        if (zindex) layer.setZIndex(zindex);
        //console.log(textObj.text);
        //console.log(zindex);
        var h,w;
        w=text.getTextWidth();
        h=text.getHeight();
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
        var tapped = false;
        text.on('dblclick',function(){
            if(textObj.hashtag==0)updateText(text);
        });
        text.on('click',function(e){
            //console.log(' touch');
            if(textObj.hashtag==0){
                currentTextObj = text;
                currentObj = characterGroup;
            }
        });
        text.on('touchstart',function(e){
            if($('html').hasClass('isMobile')||$('html').hasClass('isTablet')){
                if(!tapped){
                    tapped=setTimeout(function(){
                        tapped=null;
                        if(textObj.hashtag==0){
                            currentTextObj = text;
                            currentObj = characterGroup;
                        }
                    },300);
                }else{
                    clearTimeout(tapped);
                    tapped=null;
                    if(textObj.hashtag==0)updateText(text);
                }
            }
        });
        characterGroup.on('click touchend', function () {
            hideWrap(function(){
                updateWrapText(text);
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
        characterGroup.on('dragmove', function () {
            var o = this.children[0];
            var x = $('#savestage').offset().left+this.attrs.x+o.getTextWidth(),
                y = $('#savestage').offset().top+this.attrs.y+o.getHeight()/2;
            moveTop.css({
                'left':x,
                'top':y-32
            });
            moveBottom.css({
                'left':x,
                'top':y
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
        });

        KineticStage.addEventListener('mouseout mouseleave', function (e) {
        });
        KineticStage.addEventListener('mouseover', function (e) {
        });
        KineticStage.draw();

        textInputObj.push(characterGroup);
        characterGroup.on('click touchstart', function(e) {
            moveTop.show();moveBottom.show();
            var o = this.children[0];
            var x = $('#savestage').offset().left+this.attrs.x+o.getTextWidth(),
                y = $('#savestage').offset().top+this.attrs.y+o.getHeight()/2;
            moveTop.css({
                'left':x,
                'top':y-32
            });
            moveBottom.css({
                'left':x,
                'top':y
            });
            deleteElement.hide();
        });

        return characterGroup;
    } else {
        text = new Kinetic.Text({
            x: 0,
            y: 0,
            text: textObj.text,
            fontSize: textObj.fontSize,
            fontFamily: textObj.fontFamily,
            fill: textObj.color
        });
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
        textInputObj.push(characterGroup);
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

function showWrap(obj,callback){
    var wrapline = obj.wrapline;
    if(wrapline==null||wrapline===undefined) return;
    hideWrap(function() {
        for (var i = 0, len = wrapline.length; i < len; i++) {
            var obj = wrapline[i];
            obj.show();
            if ((i == len - 1)) {
                KineticStage.draw();
                if(typeof callback === 'function') callback();
            }
        }
    });
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

function addAnchor(group, x, y, name, dragBound) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor;
    if (dragBound == 'rotate') {
        anchor = new Kinetic.Circle({
            x: x,
            y: y,
            stroke: '#ff0000',
            strokeWidth: 2,
            radius: 14,
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
            width: 30,
            height: 30,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 1,
            name: name,
            draggable: true,
            dragOnTop: false
        });
    }
    anchor.on('dragmove', function(e) {
        update(this,e,function(){
            updateline(group);
        });
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

function update(activeAnchor,e,callback) {
    var group = activeAnchor.getParent(),
        activeHandleName = activeAnchor.getName(),
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
        offsetX = Math.abs((topLeft.getX() + bottomRight.getX() + 15) / 2),
        offsetY = Math.abs((topLeft.getY() + bottomRight.getY() + 15) / 2);
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
            break;
        default:
            break;
    }
    
    if (image !== undefined) {
        image.setAttrs({
            'x': (topLeft.getPosition().x + 30),
            'y': (topLeft.getPosition().y + 30)
        });
    }
    if (text !== undefined) {
        text.setAttrs({
            'x': (topLeft.getPosition().x + 18),
            'y': (topLeft.getPosition().y + 18)
        });
    }
    var width = topRight.getX() - topLeft.getX() - 30;
    var height = bottomLeft.getY() - topLeft.getY() - 30;
    if(image!==undefined){
        if(e.evt.shiftKey){
            newHeight = bottomLeft.getY() - topLeft.getY()-30;
            newWidth = image.getWidth() * newHeight / image.getHeight();
            if(activeHandleName === "topRight" || activeHandleName === "bottomRight") {
                image.setPosition(topLeft.getX(), topLeft.getY());
            } else if(activeHandleName === "topLeft" || activeHandleName === "bottomLeft") {
                image.setPosition(topRight.getX() - newWidth, topRight.getY());
            }
            // Set the image's size to the newly calculated dimensions
            if(newWidth && newHeight) {
                image.setSize({width:newWidth, height:newHeight});
                imageX = image.getX();
                imageY = image.getY();
                // Update handle positions to reflect new image dimensions
                topRight.setX(imageX + newWidth);
                bottomRight.setX(imageX + newWidth);
            }
        }else{
            image.setSize({
                width: width,
                height: height
            });
        }
        rotateAnchor.setX(topRight.getX()+30);
        rotateAnchor.setY(topRight.getY());
    }
    if (text !== undefined) {
        if (width < textWidth) {
            text.setFontSize(text.getFontSize() - 1);
        } else {
            text.setFontSize(text.getFontSize() + 1);
        }
    }
    if(typeof callback==='function')callback();
}

function getRotatingAnchorBounds(pos, group) {
    var topLeft = group.get('.topLeft')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var topRight = group.get('.topRight')[0];
    var absCenterX = Math.abs((topLeft.getAbsolutePosition().x + 8 + bottomRight.getAbsolutePosition().x + 8) / 2);
    var absCenterY = Math.abs((topLeft.getAbsolutePosition().y + 8 + bottomRight.getAbsolutePosition().y + 8) / 2);
    var relCenterX = Math.abs((topLeft.getX() + bottomRight.getX()) / 2);
    var relCenterY = Math.abs((topLeft.getY() + bottomRight.getY()) / 2);
    var radius = distance(relCenterX, relCenterY, topRight.getX() + 8, topRight.getY() + 30);
    var scale = radius / distance(pos.x, pos.y, absCenterX, absCenterY);
    var realRotation = Math.round(degrees(angle(relCenterX, relCenterY, topRight.getX() + 8, topRight.getY() + 30)));
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