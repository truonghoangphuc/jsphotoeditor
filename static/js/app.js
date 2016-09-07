'use strict';
const AppToolButtons = [
  {title:"New File",icon:"fa-file",method:"newFile",group:"btn-group-file"},
  {title:"Save File",icon:"fa-save",method:"appSaveFile",group:"btn-group-file"},
  {title:"Open File",icon:"fa-folder-open",method:"loadFile",group:"btn-group-file"},
  {title:"Export File",icon:"fa-cloud-upload",method:"appExportFile",group:"btn-group-file"},
  {title:"Undo",icon:"fa-undo",method:"appUnDo",group:"btn-group-command"},
  {title:"Redo",icon:"fa-repeat",method:"appReDo",group:"btn-group-command"},
  {title:"Erase",icon:"fa-eraser",method:"appErase",group:"btn-group-command"},
  {title:"Trash",icon:"fa-trash",method:"appTrash",group:"btn-group-command"},
  {title:"Zoom In",icon:"fa-search-plus",method:"appZoomIn",group:"btn-group-command"},
  {title:"Zoom Out",icon:"fa-search-minus",method:"appZoomOut",group:"btn-group-command"},
  {title:"Insert Photo",icon:"fa-file-photo-o",method:"openFileModal",group:"btn-group-photo"},
  {title:"Transform",icon:"fa-arrows",method:"appTransform",group:"btn-group-layer"},
  {title:"Merge",icon:"fa-file-zip-o",method:"appMergeLayer",group:"btn-group-layer"},
  {title:"Bring to front",icon:"fa-angle-up",method:"appToFront",group:"btn-group-layer"},
  {title:"Bring to back",icon:"fa-angle-down",method:"appToBack",group:"btn-group-layer"},
  {title:"Bring to top",icon:"fa-angle-double-up",method:"appToTop",group:"btn-group-layer"},
  {title:"Bring to bottom",icon:"fa-angle-double-down",method:"appToBottom",group:"btn-group-layer"}
];
const AppFilterPreset =[
  {title:"Juno",img:""},
  {title:"Juno",img:""}
];
//top-left, top, top-right, right, bottom-right, bottom, bottom-left or left
const AppFilterObject = [
  {title:"Grayscale",method:"Grayscale"},
  {title:"Brighten",method:"Brighten",option:[{type:"range",title:"Brightness",properties:{min:-1,max:1,step:0.1,value:0,config:"brightness"}}]},
  {title:"Contrast",method:"Contrast",option:[{type:"range",title:"Value",properties:{min:-1,max:1,step:0.1,value:0,config:"contrast"}}]},
  {title:"Invert",method:"Invert"},
  {title:"Blur",method:"Blur",option:[{type:"range",title:"Radius",properties:{min:0,max:100,step:1,value:10,config:"blurRadius"}}]},
  {title:"Mask",method:"Mask",option:[{type:"range",title:"Threshold",properties:{min:0,max:500,step:1,config:"threshold"}}]},
  {title:"RGB",method:"RGB",option:[{type:"range",title:"Red",properties:{min:0,max:255,step:1,value:0,config:"red"}},{type:"range",title:"Green",properties:{min:0,max:255,step:1,value:0,config:"green"}},{type:"range",title:"Blue",properties:{min:0,max:255,step:1,value:0,config:"blue"}}]},
  {title:"HSV",method:"HSV",option:[{type:"range",title:"Hue",properties:{min:0,max:359,step:1,value:0,config:"hue"}},{type:"range",title:"Saturation",properties:{min:-1,max:1,step:0.1,value:0,config:"saturation"}},{type:"range",title:"Value",properties:{min:-1,max:1,step:0.1,value:0,config:"value"}}]},
  {title:"HSL",method:"HSL",option:[{type:"range",title:"Hue",properties:{min:0,max:359,step:1,value:0,config:"hue"}},{type:"range",title:"Saturation",properties:{min:-1,max:1,step:0.1,value:0,config:"saturation"}},{type:"range",title:"Luminance",properties:{min:-1,max:1,step:0.1,value:0,config:"luminance"}}]},
  {title:"Emboss",method:"Emboss",option:[
    {type:"range",title:"Strength",properties:{min:0,max:1,step:0.1,value:0.5,config:"embossStrength"}},
    {type:"range",title:"WhiteLevel",properties:{min:-1,max:1,step:0.1,value:0.5,config:"embossWhiteLevel"}},
    {type:"select",title:"Direction",properties:{value:'top-left',config:"embossDirection"},options:['top-left','top','top-right','right','bottom-right','bottom','bottom-left','left']},
    {type:"range",title:"Blend",properties:{min:0,max:10,step:1,value:0,config:"embossBlend"}}]},
  {title:"Enhance",option:[{type:"range",title:"Enhance",properties:{min:0,max:255,step:1,value:0,config:"enhance"}}]},
  {title:"Posterize",option:[{type:"range",title:"Levels",properties:{min:0,max:1,step:0.1,value:0,config:"levels"}}]},
  {title:"Noise",option:[{type:"range",title:"Value",properties:{min:0,max:1,step:0.1,value:0,config:"noise"}}]},
  {title:"Pixelate",option:[{type:"range",title:"Size",properties:{min:0,max:100,step:1,value:0,config:"pixelSize"}}]},
  {title:"Threshold",option:[{type:"range",title:"Threshold",properties:{min:0,max:1,step:0.1,value:0,config:"threshold"}}]},
  {title:"Sepia"},
  {title:"Solarize"},
  {title:"Kaleidoscope",method:"Kaleidoscope",option:[{type:"range",title:"Power",properties:{min:0,max:10,step:1,value:2,config:"kaleidoscopePower"}},{type:"range",title:"Angle",properties:{min:0,max:360,step:1,value:0,config:"kaleidoscopeAngle"}}]}
];
const blendmode = ['source-over','source-in','source-out','source-atop',
'destination-over','destination-in','destination-out','destination-atop',
'lighter','copy','xor','multiply','screen','overlay','darken',
'lighten','color-dodge','color-burn','hard-light','soft-light',
'difference','exclusion','hue','saturation','color','luminosity'];

var jcrop_api;

const DrawAppBox = React.createClass({
  getInitialState: function() {
    return {message:null,panels:null,blendable:false,layerItems:null,selectedLayers:[],currentLayer:{opacity:function(){return 1;}}};
  },
  componentDidMount: function() {
    var panels = [],$this=this;
    for (var ref in this.refs) {
      //console.log(this.refs[ref].props.type);
      if(this.refs[ref].constructor.displayName=='AppPanel'){
        panels.push(this.refs[ref]);
        var i = panels.length;
        var panel = this.refs[ref];
        if(i>1){
          var pD = ReactDOM.findDOMNode(panels[i-2]);
          panel.move(panel.state.right,panels[i-2].state.top+pD.offsetHeight);
        }
      }
      this.setState({panels:panels});
    }
    this.refs.panelmanual.setStage(this.refs.appstage);
    this.refs.apptoolbar.setStage(this);
    this.drawToStage(this.refs.appstage.state.layers);
  },
  componentWillUnmount: function(){
  },
  handleClick: function(method,e){
    var ref = method.substring(0,3);
    if(ref=='app'){
      this.refs.appstage[method](e);
    }else{
      this[method](e);
    }
  },
  handleAppSubmit: function(comment) {    
  },
  showMessage: function(html,callback) {
    this.setState({message:html});
    this.refs.modalmess.getInstance().on('shown.bs.modal',callback);
    this.refs.modalmess.open();
  },
  confirmMessModal: function(){
    this.refs.modalmess.getInstance().off('shown.bs.modal',function(){});
    this.refs.modalmess.close();
  },
  showLoading: function(callback) {
    this.refs.apploading.showLoading();
    if(typeof callback==='function')callback();
  },
  hideLoading: function(callback) {
    this.refs.apploading.hideLoading();
    if(typeof callback==='function')callback();
  },
  loadFile: function(){
    $('#fileDialog').trigger('click');
  },
  handleOpenFile: function(e){
    var $this = this;
    var files = e.target.files;
    $this.showLoading();
    $this.refs.appstage.openFile(files,function(){
      $this.hideLoading();
    });
  },
  newFile: function(opt){
    this.refs.appstage.createNewFile(opt);
    this.refs.modalnew.close();
  },
  openEffectPanel: function(callback){
    this.refs.panelmanual.open();
    if(typeof callback==='function') callback();
  },
  openFileModal: function() {
    this.refs.modal.open();
  },
  confirmFileModal: function() {
    if(this.props.fileCurrentSelect.length<=0){
        bootbox.alert('You need select at least 1 photo');
        return;
    }
    var $this = this,arr = this.props.fileCurrentSelect;
    for(var i=0,len=arr.length;i<len;i++){
      this.handleLoadPhoto(this.props.fileCurrentSelect[i],function(){
        $this.refs.editupload.updateData($this.props.fileEdited);
        $this.openPhotoModal();
      });     
    }
    this.refs.modal.close();
  },
  handleFileModalDidClose: function() {
  },
  handleFileModalCancel: function() {
    this.refs.modal.close();
  },
  openPhotoModal: function() {
    this.refs.modalphoto.open();
  },
  closePhotoModal: function() {
    var cans = this.props.fileEdited;//$('#editArea').find('canvas.new');
    for(var i=0,len=cans.length;i<len;i++){
      if(cans[i].status==undefined){
        var c = cans[i].canvas;
        this.props.fileImported.push(c);
        var drawOpt = {};
        drawOpt.draggable = true;
        drawOpt.zindex = i+1;
        this.refs.appstage.appDrawImage(c,cans[i].name,drawOpt);
        cans[i].status = "added";
      }
    }
    this.refs.modalphoto.close();
  },
  handlePhotoModalCancel: function() {
    this.refs.modalphoto.close();
  },
  openNewFileModal: function() {
    this.refs.modalnew.open();
  },
  handleNewModalCancel: function(){
    this.refs.modalnew.close();
  },
  confirmNewModal: function(){
    var opt = {};
    var $this=ReactDOM.findDOMNode(this.refs.modalnew);
    var inputs = $this.querySelectorAll('.form-control');
    opt.width=inputs[0].value;
    opt.height=inputs[1].value;
    opt.background=inputs[2].value;
    this.newFile(opt);
  },
  handleLoadPhoto: function(file,callback){
    var $this = this;
    var isPhone = this.props.mobileMode,
        reader  = new FileReader(),
        canvas = null,
        item = {src:file,img:null,canvas:null};
    reader.addEventListener("load", function () {
      $this.props.fileCurrentSelect.shift();
      if(isPhone){
        var imgT = new Image();
        var canvast = document.createElement('canvas');
        var ctx = canvast.getContext('2d');
        imgT.onload = function(){
            canvast.width = imgT.width;
            canvast.height = imgT.height;
            ctx.save();
            var width  = canvast.width;  
            var styleWidth  = canvast.style.width;
            var height = canvast.height; 
            var styleHeight = canvast.style.height;
            EXIF.getData(this,function() {
                var orientation = EXIF.getTag(this,"Orientation");
                if (orientation > 4) {
                    canvast.width  = height; canvast.style.width  = styleHeight;
                    canvast.height = width;  canvast.style.height = styleWidth;
                }
                switch(orientation){
                    case 2:
                        // horizontal flip
                        ctx.translate(canvast.width, 0);
                        ctx.scale(-1, 1);
                        break;
                    case 3:
                        // 180° rotate left
                        ctx.translate(canvast.width, canvast.height);
                        ctx.rotate(Math.PI);
                        break;
                    case 4:
                        // vertical flip
                        ctx.translate(0, canvast.height);
                        ctx.scale(1, -1);
                        break;
                    case 5:
                        // vertical flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.scale(1, -1);
                        break;
                    case 6:
                        // 90° rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(0, -height);
                        break;
                    case 7:
                        // horizontal flip + 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(canvast.width, -canvast.height);
                        ctx.scale(-1, 1);
                        break;
                    case 8:
                        // 90° rotate left
                        ctx.rotate(-0.5 * Math.PI);
                        ctx.translate(-canvast.width, 0);
                        break;
                }
                ctx.drawImage(imgT,0,0);
                ctx.restore();
                var image = new Image();
                image.title = file.name;
                image.onload = function(){
                    var can = document.createElement('canvas');
                    if(can!==null){
                        var context = can.getContext("2d");
                        can.width = image.width;
                        can.height = image.height;
                        context.drawImage(this,0,0,image.width,image.height,0,0,can.width,can.height);
                    }
                    item.img = image;
                    item.canvas = canvas;
                    item.name = file.name;
                    $this.props.fileEdited.push(item);
                    if($this.props.fileEdited.length==$this.props.fileSelects.length){
                      if(typeof callback==='function'){
                        callback();
                      }
                    }
                }
                image.src = canvast.toDataURL();
            });
        }
        imgT.src = this.result;
      }else{
        var image = new Image();
        image.title = file.name;
        image.onload = function(){
          canvas = document.createElement('canvas');
          if(canvas!==null){
            var context = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(this,0,0,image.width,image.height,0,0,canvas.width,canvas.height);
          }
          item.img = image;
          item.canvas = canvas;
          item.name = file.name;
          $this.props.fileEdited.push(item);
          if($this.props.fileCurrentSelect.length==0){
            if(typeof callback==='function'){
              callback();
            }
          }
        }
        image.src = this.result;
      }
    }, false);
    reader.readAsDataURL(file);
  },
  openCropFileModal: function(callback) {
    //console.log($(this.refs.modalcrop));
    this.refs.modalcrop.getInstance().on('shown.bs.modal',callback);
    this.refs.modalcrop.open();
  },
  confirmCropModal: function(){
    this.handleJCropModal();
    this.refs.modalcrop.getInstance().off('shown.bs.modal',function(){});
    this.refs.modalcrop.close();
  },
  cancelCropModal: function(){
    this.refs.modalcrop.getInstance().off('shown.bs.modal',function(){});
    this.refs.modalcrop.close();
  },
  handleJCropModal: function(){
    var canvas = $('#targetCanvas')[0],
        can = $('.frame-item.active').find('canvas')[0],
        $image = $('#imgCapture');
    if(can!==null){
        var context = can.getContext("2d");
        can.width = canvas.width;
        can.height = canvas.height;
        context.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,can.width,can.height);
        this.refs.modalcrop.close();
        $image.hide();
        jcrop_api.destroy();
    }
  },
  handleExportPhoto: function(){
    var $this = this;
    $this.showLoading();
    this.refs.appstage.exportFile(function(){
      $this.hideLoading();
    });
  },
  handleOpacity: function(e){
    var i = e.target,
        l = i.previousElementSibling||i.previousSibling,
        o = l.children;
    o[0].innerText = i.value;
    this.refs.appstage.setOpacity(i.value/100);
    this.setState({currentLayer:this.refs.appstage.state.currentlayer});
  },
  handleBlend: function(e){
    var $this=this,
        i = e.target,
        arr = [];
    this.state.layerItems.forEach(function(l,i){
      if(l.props.selected)arr.push(l);
    });
    this.refs.appstage.blend(i.value,arr,function(){
      $this.setState({currentLayer:$this.refs.appstage.state.currentlayer});
    });
  },
  selectLayer: function(e,selected,layer){
    var $this = this;
    var arr = this.state.selectedLayers,
        k = e.target.getAttribute('data-id');
    if(!e.ctrlKey&&!e.metaKey){
      for(var i=0,len=arr.length;i<len;i++){
        arr[i] = false;
      }
    }
    arr[k]=selected;
    this.setState({selectedLayers:arr});
    if(this.state.selectedLayers.length>2){
      this.setState({blendable:true});
    }else{
      this.setState({blendable:false});
    }
    this.refs.appstage.setCurrentLayer(layer,function(){
      $this.drawToStage($this.refs.appstage.state.layers);
      // var obj = $this.refs.appstage.state.currentlayer;
      // showWrap(obj);
      $this.setState({currentLayer:layer},function(){
        $this.refs.panelfilter.handleSwitchObject();
      });
    }); 
  },
  drawToStage: function(layers,callback){
    var $this = this;
    var layerItems = [];
    if(layers!==null&&layers!==undefined){
      layers.sort(function (a, b) {
        if (a.index > b.index) {
          return 1;
        }
        if (a.index < b.index) {
          return -1;
        }
        return 0;
      });
      layers.forEach(function(l,i){
        layerItems.push(<AppLayer key={i} id={i} data-ref={l} selected={$this.state.selectedLayers[i]} title={l.layername} handleClick={$this.selectLayer}></AppLayer>);
      });
      layerItems.reverse();
      this.setState({layerItems:layerItems},function(){
        if(typeof callback==='function') callback();
        var sortable = Sortable.create(document.querySelector('.group-layers'),{
          handle: '.drag-handle',
          animation: 150,
          onEnd: function(evt) {
            //console.log(evt);
          },
          onUpdate: function(evt) {
            var i = evt.item.getAttribute('data-id'),
                x = $this.refs.appstage.state.layers.length - getNodeIndex(evt.item);
            var layer = $this.refs.appstage.state.layers[i];
            $this.refs.appstage.setZIndex(layer,x);
          }
        });
      });
    }
  },
  updateLayers: function(){
    var $this = this,
        items = this.state.layerItems;
    items.sort(function (a, b) {
      if (a.props['data-ref'].index > b.props['data-ref'].index) {
        return 1;
      }
      if (a.index < b.index) {
        return -1;
      }
      return 0;
    });
    items.reverse();
    this.setState({layerItems:items},function(){
      console.log('done');
    });
  },
  render: function() {
    var $this = this;
    var modal = null;
    modal = (
      <AppModal ref="modal" confirm="OK" cancel="Cancel" onCancel={this.handleFileModalCancel} onConfirm={this.confirmFileModal} id="fileModal" title="ReactPhotoEdito - Add Photos">
        <AppUpload fileCurrentSelect={this.props.fileCurrentSelect}></AppUpload>
      </AppModal>
    );
    var modalEditPhoto = null;
    modalEditPhoto = (
      <AppModal ref="modalphoto" confirm="OK" cancel="Cancel" onCancel={this.handlePhotoModalCancel} onConfirm={this.closePhotoModal} id="photoModal" title="ReactPhotoEdito - Edit Photos">
        <AppEditUpload ref="editupload" openJCrop={this.openCropFileModal}></AppEditUpload>
      </AppModal>
    );
    var modalNew = null;
    modalNew = (
      <AppModal ref="modalnew" size="modal-small" confirm="OK" cancel="Cancel" onCancel={this.handleNewModalCancel} onConfirm={this.confirmNewModal} id="newModal" title="ReactPhotoEdito - Create New File">
        <div className="form-group row">
          <label className="col-xs-12 control-label">File size (pixel)</label>
          <div className="col-xs-5">
            <BootstrapInput className="form-control" placeholder="width" type="number" min="50" max="10000"></BootstrapInput>
          </div>
          <div className="col-xs-2 text-center">&times;</div>
          <div className="col-xs-5">
            <BootstrapInput className="form-control" placeholder="height" type="number" min="50" max="10000"></BootstrapInput>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-xs-12 control-label">Background Color</label>
          <div className="col-xs-12">
            <select className="form-control selectpicker" defaultValue="#none">
              <option value="#none">Transparent</option>
              <option value="#fff">White</option>
              <option value="#000">Black</option>
            </select>
          </div>
        </div>
      </AppModal>
    );
    var modalJcrop = null;
    modalJcrop = (
      <AppModal ref="modalcrop" size="modal-large" confirm="OK" cancel="Cancel" onCancel={this.cancelCropModal} onConfirm={this.confirmCropModal} id="cropModal" title="ReactPhotoEdito - Crop File">
        <div className="wrapper">
          <div className="img">
            <div id="imgJcrop">
              <img id="imgCapture" src="images/loading.gif" alt="" className="cropper"/>
            </div>
            <canvas width="480" height="480" id="targetCanvas"></canvas>
          </div>
        </div>
      </AppModal>
    );
    var modalMessage = null;
    modalMessage = (
      <AppModal ref="modalmess" className="pop-message" confirm="OK" onConfirm={this.confirmMessModal} id="fileModalMess">
        {this.state.message}
      </AppModal>
    );
    var panelManualFilter = null;
    panelManualFilter = (
      <AppPanel ref="panelmanual" className="manual-filters" title="Filters">
        <AppFilterPanel ref="panelfilter" appstage={this.refs.appstage} items={AppFilterObject} id="panelManualEffect"></AppFilterPanel>
      </AppPanel>
    );
    var panelLayer = null;
    var blenditems = [];
    blenditems.push(<option key='0' value='none'>Normal</option>);
    blendmode.forEach(function(item,index) {
      blenditems.push(<option key={index+1} value={item}>{item}</option>);
    });
    panelLayer = (
      <AppPanel ref="panellayer" title="Layers" className="layers-panel" id="panelLayers">
        <div className="form-group row">
          <label>Blend: </label>
          <select className="form-control" disabled={!this.state.blendable} onChange={this.handleBlend}>
            {blenditems}
          </select>
        </div>
        <div className="form-group">
          <label>Opacity: <strong>{this.state.currentLayer.opacity()*100}</strong>%</label><input type="range" max="100" min="0" step="1" value={this.state.currentLayer.opacity()*100} onChange={this.handleOpacity}/>
        </div>
        <div className="form-group group-layers">
          {$this.state.layerItems}
        </div>
      </AppPanel>
    );
    return (
      <div className="main-app">
        <AppToolbar ref="apptoolbar" buttons={AppToolButtons}/>
        <AppStage ref="appstage" mobileMode={this.props.mobileMode} url="/api/photo" onMessage={this.showMessage} onDraw={this.drawToStage} onUpdate={this.updateLayers}/>
        <BootstrapInput type="file" className="file-dialog" id="fileDialog" onChange={this.handleOpenFile}></BootstrapInput>
        {modal}
        {modalEditPhoto}
        {modalNew}
        {modalJcrop}
        {modalMessage}
        {panelManualFilter}
        {panelLayer}
        <BootstrapLoading ref="apploading"></BootstrapLoading>
      </div>
    );
  }
});

const AppToolbarButton = React.createClass({
  getInitialState: function() {
    return {stage:null};
  },
  setStage: function(stage){
    this.setState({stage:stage});
  },
  componentDidMount: function() {

  },
  handleClick: function(e){
    var method = this.props.button.method;
    this.state.stage.handleClick(method,e);
  },
  render: function() {
    var classname = "fa"+" "+this.props.button.icon;
    var opts = {};
    if (this.props.button.custom) {
      var customAttr = [];
      customAttr =  this.props.button.custom.split(' ');
      for(var i=0,len=customAttr.length;i<len;i++){
        var custom = customAttr[i].split('=');
        opts[custom[0]] = custom[1];
      }
    }
    return (
      <a className="btn btn-default" {...opts} title={this.props.button.title} href="javascript:void(0);" onClick={this.handleClick}>
        <span className={classname}>
        </span>
      </a>
    );
  }
});
const AppToolbarGroup = React.createClass({
  getInitialState: function() {
    return {stage:null};
  },
  setStage: function(stage){
    this.setState({stage:stage});
    for(var ref in this.refs) {
      var button = this.refs[ref];
      button.setStage(stage);
    }
  },
  render: function() {
    var btns = [],
        currentIndex = 0;
    this.props.buttons.forEach(function(button) {
      btns.push(<AppToolbarButton ref={'root'+currentIndex} button={button} key={this.props.groupid + '_' + currentIndex} />);
        currentIndex++;
    }.bind(this));
    var classgroup = "btn-group " + this.props.buttons[0].group;
    return(
      <div className={classgroup}>
        {btns}
      </div>
    );
  }
});
const AppToolbar = React.createClass({
  getInitialState: function() {
    return {stage:null};
  },
  setStage: function(stage){
    for(var ref in this.refs) {
      var toolgroup = this.refs[ref];
      toolgroup.setStage(stage);
    }
    this.setState({stage:stage});
  },
  render: function() {
    var groups = [],
        grouparr = [],
        currentGroup = this.props.buttons[0].group,
        currentIndex = 1;
    this.props.buttons.forEach(function(button,index) {
      if(button.group==currentGroup){
        grouparr.push(button);
      }else{
        groups.push(<AppToolbarGroup ref={'root'+currentIndex} buttons={grouparr} key={currentIndex} groupid={currentIndex}/>);
        grouparr = [];
        currentIndex++;
        grouparr.push(button);
      }
      currentGroup = button.group;
      if(index==this.props.buttons.length-1)groups.push(<AppToolbarGroup ref={'root'+currentIndex} buttons={grouparr} key={currentIndex} groupid={currentIndex}/>);
    }.bind(this));
    return (
      <div className="toolbar-wrapper">
        <div className="nav nav-pills">
          {groups}
        </div>
      </div>
    );
  }
});
const BoostrapImage = React.createClass({
  getInitialState: function(){
    return {
      isEmpty:false
    }
  },
  handleLoad:function(e){
    if(typeof this.props.onLoad==='function'){
      this.props.onLoad(e);
    }
  },
  render: function() {
    return (
      <img {...this.props} className={(this.props.className || '')} onLoad={this.handleLoad}/>
    );
  }
});
const BootstrapSelect = React.createClass({
  getInitialState: function(){
    return {
      isError:false
    }
  },
  addError: function(){
    this.setState({isError:true});
  },
  handleChange:function(e){
    if(typeof this.props.onChange==='function'){
      this.props.onChange(e);
    }
  },
  render: function() {
    var classes = this.state.isError ? " has-error" : "";
    var opt = [];
    this.props["data-options"].forEach(function(i,x){
      opt.push(<option value={i} key={i}>{i}</option>);
    });
    return (
      <select {...this.props} value={this.props.value} className={(this.props.className || '') + classes} onChange={this.handleChange}>
        {opt}
      </select>
    );
  }
});
const BootstrapInput = React.createClass({
  getInitialState: function(){
    return {
      isError:false
    }
  },
  handleChange:function(e){
    switch (this.props.type){
      case 'number':
        if(!validation.isNumber(e.target.value)){
          this.state.isError = true;
        }
        break;
      case 'email':
        break;
      default:
        break;
    }
    if(typeof this.props.onChange==='function'){
      this.props.onChange(e);
    }
  },
  render: function() {
    var classes = this.state.isError ? " has-error" : "";
    return (
      <input {...this.props} type={this.props.type} value={this.props.value} className={(this.props.className || '') + classes} onChange={this.handleChange}/>
    );
  }
});
const BootstrapButton = React.createClass({
  render: function() {
    return (
      <button {...this.props}
        role="button"
        className={(this.props.className || '') + ' btn'}>{this.props.children}</button>
    );
  }
});
const BootstrapLoading = React.createClass({
  getInitialState: function(){
    return {
      isLoading:false
    }
  },
  showLoading:function(){
    this.setState({isLoading:true});
  },
  hideLoading:function(){
    this.setState({isLoading:false});
  },
  render: function() {
    var classes = (this.state.isLoading)?'show':'';
    return (
      <div ref="root" {...this.props} className={(this.props.className || '') + classes + ' loading-overlay'} id={this.props.id}>
        <div className="loading">{this.props.children}</div>
      </div>
    );
  }
});
const AppFilterPanel = React.createClass({
  componentDidMount: function() {
    var $this = this;
    var opt = ReactDOM.findDOMNode(this).querySelectorAll('.option-item');
    opt.forEach(function(item,index){ 
      var p = item.getAttribute('data-props');
      if(p!==null){
        p=p.split(',');
        p.forEach(function(i,x){
          if(i!==null){
            var a = i.split('|')[0],b=i.split('|')[1];
            item.setAttribute(a,b);
          }
        });
      }
      if(item.value==null||item.value==undefined)item.value=0;
    });
  },
  componentWillUnmount: function() {
    
  },
  getInstance: function(){
    return $(this.refs.root);
  },
  handleChange: function(e){
    if(this.props.appstage==null)return;
    var method = e.target.value;
    this.props.appstage.appFilter(method);
    var optRef = e.target.options[e.target.selectedIndex].getAttribute('data-ref');
    var s = document.querySelector('.effect-option.show');
    if(s){
      s.classList.remove('show');
    }
    var a = document.querySelector('.effect-option[data-ref="'+optRef+'"]');
    if(a){
      a.classList.add('show');
    }
  },
  handleOption: function(e){
    var opt = e.target.getAttribute('config');
    var method = opt.toString();
    if(this.props.appstage==null)return;
    this.props.appstage.appFilterOption(method,e.target.value);
  },
  handleApply: function(e){
    if(this.props.appstage==null)return;
    this.props.appstage.saveApplyFilter();
  },
  handleCancel: function(e){
    if(this.props.appstage==null)return;
    this.props.appstage.cancelFilter();
  },
  handleReset: function(e){
    if(this.props.appstage==null)return;
    this.props.appstage.resetFilter();
  },
  handleSwitchObject: function(e){
    var $this = this;
    var opt = ReactDOM.findDOMNode(this).querySelector('#select_'+$this.props.id);
    opt.value = '';
    var s = document.querySelector('.effect-option.show');
    if(s){
      s.classList.remove('show');
    }
  },
  render: function() {
    var $this = this;
    var items = [],
        options = [];
    items.push(<option key="0" value="">None</option>);
    this.props.items.forEach(function(item,index) {
      items.push(<option key={index+1} value={item.method} data-ref={'option'+index}>{item.title}</option>);
      if(item.option!==undefined){
        var option = [];
        item.option.forEach(function(opt,idx){
          var pts = opt.properties, props =[];
          Object.keys(pts).forEach(function(key,index) {
            props.push(key+"|"+pts[key]);
          });
          if(opt.type=='input'||opt.type=='range'||opt.type=='checkbox'||opt.type=='radio'){
            option.push(
              <div className="form-group" key={"opt"+index+1+"_"+idx}>
                <label className="caption">{opt.title}</label>
                <BootstrapInput className="option-item" type={opt.type} onChange={$this.handleOption} data-props={props}></BootstrapInput>
              </div>
            );
          }else if(opt.type=="select"){
            option.push(
              <div className="form-group" key={"opt"+index+1+"_"+idx}>
                <label className="caption">{opt.title}</label>
                <BootstrapSelect className="option-item form-control" onChange={$this.handleOption} data-props={props} data-options={opt.options}></BootstrapSelect>
              </div>
            );
          }
        });
        options.push(
          <div className="effect-option" data-ref={'option'+index} key={"opt"+index+1}>{option}</div>
        );
      }
    });
    return (
      <div className="form" ref="root">
        <div className="form-group">
          <select className="form-control" id={'select_'+this.props.id} onChange={this.handleChange}>{items}</select>
          {options}
        </div>
        <div className="form-group cmd">
          <BootstrapButton onClick={this.handleApply} className="btn-primary">Apply</BootstrapButton>
          <BootstrapButton onClick={this.handleCancel} className="btn-danger">Cancel</BootstrapButton>
        </div>
      </div>
    );
  }
});
const AppPanel = React.createClass({
  getInitialState: function(){
    return {
      isOpening:true,
      right:0,
      top:0,
      zindex:1,
      appstage:null
    }
  },
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
    
  },
  componentWillReceiveProps: function(){

  },
  setStage:function(stage){
    this.setState({appstage:stage});
  },
  close: function() {
    this.setState({isOpening:false});
  },
  open: function() {
    this.setState({isOpening:true});
  },
  toggle: function() {
    this.setState({isOpening:!this.state.isOpening});
  },
  move: function(x,y) {
    this.setState({right:x,top:y});
  },
  moveend: function(e) {
    var div = e.target,
        divL = div.offsetLeft,
        divT = div.offsetTop,
        l = e.clientX,
        t = e.clientY,
        r;
    r = (window.innerWidth - l)-300;
    this.setState({right:r,top:t-div.offsetHeight,zindex:2});
  },
  getInstance: function(){
    return $(this.refs.root);
  },
  render: function() {
    var $this = this;
    var classes = (this.state.isOpening)?'show ':'';
    var close = (this.state.isOpening)? 'x':'-';
    classes+=this.props.className;
    var styleInline = {right:this.state.right,top:this.state.top,zIndex:this.state.zindex};
    return (
      <div ref="root" className={classes + ' panel panel-success window-panel'} id={this.props.id} style={styleInline}>
        <div className="panel-heading" onDragEnd={this.moveend} draggable="true">
          <h3 className="panel-title">{this.props.title}</h3>
          <button type="button" className="close" onClick={this.toggle}>{close}</button>
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    );
  }
});
const AppModal = React.createClass({
  componentDidMount: function() {
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: false});
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden);
  },
  componentWillUnmount: function() {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden);
  },
  close: function() {
    $(this.refs.root).modal('hide');
  },
  open: function() {
    $(this.refs.root).modal('show');
  },
  getInstance: function(){
    return $(this.refs.root);
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;
    var option = '';
    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton onClick={this.handleConfirm} className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    if(this.props.cancel) {
      cancelButton = (
        <BootstrapButton onClick={this.handleCancel} className="btn-default">
          {this.props.cancel}
        </BootstrapButton>
      );
    }
    if(this.props.size){
      option = this.props.size;
    }
    return (
      <div className={(this.props.className || '') + ' modal fade'} ref="root" id={this.props.id}>
        <div className={option +' modal-dialog'}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleCancel}>&times;</button>
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  },
  handleHidden: function() {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  }
});
const AppUpload = React.createClass({
  getInitialState: function(){
    return {
      isHovering: false,
      isHasFile:false
    };
  },
  parseFile: function (file){
    this.props.fileCurrentSelect.push(file);
    if(this.props.fileCurrentSelect.length){
      this.setState({
        isHasFile:true
      });
    }
    // if(this.props.fileCurrentSelect.length>=8){
    //   this.setState({
    //     isFull:true
    //   });
    // }
  },
  fileSelectHandler: function(e){
    this.fileDragHover(e);
    var len = 0,
        files = e.target.files || e.dataTransfer.files,
        max_size = e.target.getAttribute('data-max-size'),
        max_upload = e.target.getAttribute('data-max-upload');

    if(e.target.nodeName.toLowerCase()!=='input'&&e.target.id!=='fileDrag'){
      max_size = e.target.parentElement.getAttribute('data-max-size'),
      max_upload = e.target.parentElement.getAttribute('data-max-upload');
    }
    for (var i = 0, f; f = files[i]; i++) {
      if(this.props.fileCurrentSelect.length>=max_upload)return;
      if(f.size>max_size){
          bootbox.alert('Dung lượng hình là '+parseFloat(f.size/(1024*1024)).toFixed(2) +'MB. Dung lượng tối đa cho phép là '+max_size/(1024*1024)+'MB');
      }else{
          len++;
          this.parseFile(f);
      }
    }
  },
  fileDragHover: function(e){
    e.stopPropagation();
    e.preventDefault();
    e.type == "dragover" ? this.setState({ isHovering: true }) : this.setState({ isHovering: false });
  },
  componentDidMount: function(){
    console.log()
  },
  componentWillUnmount: function(){

  },
  dragControl: function(){
    if('draggable' in document.createElement('span')) {
      var classes = this.state.isHovering ? "hover" : "";
      return (
        <div className={classes + ' drag-area'} id="fileDrag" data-max-upload="8" data-max-size="8388608" onDragOver={this.fileDragHover} onDragLeave={this.fileDragHover} onDrop={this.fileSelectHandler}>
            <p>Drag and Drop or click to <br/><strong>[Select]</strong> to insert your photos</p>
        </div>
      )
    }else{
      return false;
    }
  },
  render: function(){
    //var classes = this.state.isFull ? "full" : "";
    return(
      <div className="upload-area">
        {this.dragControl()}
        <BootstrapButton className="btn-fab btn-danger"><i className="material-icons">file_upload</i><input id="fileInput" multiple="multiple" accept="image/*" type="file" name="" value="" placeholder="" data-max-upload="8" data-max-size="8388608" onChange={this.fileSelectHandler}/></BootstrapButton>
      </div>
    );
  }
});
const AppEditPhotoCanvas = React.createClass({
  componentDidMount: function () {
    ReactDOM.findDOMNode(this).appendChild(this.props.canvas);
  },
  render: function() {
    return <div />;
  }
});
const AppEditUploadItem = React.createClass({
  updatePreview: function(c){
    var canvas = $('#targetCanvas')[0],
        $image = $('#imgCapture');
    if (parseInt(c.w) > 0) {
        var img = $image.get(0);
        var context = canvas.getContext("2d");
        var r = img.width/parseInt($(img).css('width'));
        if(r<=0)r=1;
        canvas.width = c.w*r;
        canvas.height = c.h*r;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img,c.x*r,c.y*r,c.w*r,c.h*r,0,0,canvas.width,canvas.height);    
    }
  },
  handleClick: function(e){
    e.preventDefault();
    e.stopPropagation();

    var $this=this,
        $t = $(e.target),
        $image = $('#imgCapture');
    $('.frame-item').removeClass('active');
    $t.addClass('active');
    if(!$t.find('canvas').length){
        $t.children('div').append('<canvas></canvas>');
    }
    if(typeof $this.props.openJCrop==='function'){
      $this.props.openJCrop(function(){
        var img = $image.get(0);
        img.onload = function() {
            if (jcrop_api) {
                jcrop_api.destroy();
                $image.removeAttr('style');
            }
            $image.Jcrop({
                bgColor: 'black',
                bgOpacity: 0.4,
                setSelect: [50, 50, 200, 200],
                onSelect: $this.updatePreview
            }, function() {
                jcrop_api = this;
                $('body').on('mousemove',function(e){
                  if(e.shiftKey){
                    jcrop_api.setOptions({
                        aspectRatio: '1.0'
                    }); 
                  }else{
                    jcrop_api.setOptions({
                        aspectRatio: 0
                    });
                  }
                });
            });
        };
        img.src = $t.children('img').attr('src');
      });
    }
  },
  render: function(){
    var canvas = [];
    canvas.push(<AppEditPhotoCanvas key={this.props.index} canvas={this.props.item.canvas}/>);
    return(
      <li data-draggable="true">
        <a className="frame-item" href="javascript:void(0)" data-name={this.props.item.src.name} onClick={this.handleClick}>
          <img src={this.props.item.img.src}/>
          <label><i className="fa fa-arrows-alt"></i><i className="fa fa-crop"></i></label>
          {canvas}
        </a>
      </li>
    );
  }
});
const AppEditUpload = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function () {
    var sortable = Sortable.create(document.querySelector('#editArea'));
  },
  updateData: function(newdata){
    this.setState({data:newdata});
  },
  render: function(){
    var images = [],
        data = [];
    data = this.state.data;
    for(var i=0,len=data.length;i<len;i++){
      images.push(<AppEditUploadItem item={data[i]} index={i} key={'photo_' + i} openJCrop={this.props.openJCrop}/>);
    }
    return(
      <div className="edit-area">
          <ul id="editArea">
          {images}
          </ul>
      </div>
    );
  }
});
const AppLayer = React.createClass({
  getInitialState: function() {
    return {opacity:1,zindex:1,name:''};
  },
  componentDidMount: function(){
    this.setState({name:this.props.title});
  },
  componentWillMount: function(){
    
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({name:nextProps.title});
  },
  setOpacity: function(v){
    this.setState({opacity:v});
  },
  setName: function(v){
    this.setState({name:v});
  },
  setZIndex: function(v){
    this.setState({zindex:v});
  },
  enableEditName: function(e){
    var div = e.target;
    div.contentEditable = true;
    div.classList.add('editing');
  },
  handleKeyPress: function(e){
    var div = e.target;
    if(e.charCode=='13'){
      if(div.getAttribute('contentEditable')=='true'){
        this.setName(div.textContent);
        div.removeAttribute('contenteditable');
        div.classList.remove('editing');
      }
    }
  },
  handleClick: function(e){
    this.props.handleClick(e,!this.props.selected,this.props["data-ref"]);
  },
  render: function(){
    var classes = this.props.selected ? "selected" : "";
    return(
      <div data-id={this.props.id} className={classes + ' layer'} title={this.props.title} onClick={this.handleClick} >
        <i className="material-icons dp32 drag-handle">view_headline</i>
        <span className="input layer-name" onKeyPress={this.handleKeyPress} onDoubleClick={this.enableEditName}>{this.state.name}</span>
      </div>
    );
  }
});
const AppStage = React.createClass({
  getCurrentInstance: function(){
    return ReactDOM.findDOMNode(this);
  },
  getInitialState: function() {
    return {zoom:100,data:null,result:null,layers:[],currentlayer:null};
  },
  componentDidMount: function(){
    var $this = ReactDOM.findDOMNode(this);
    $this.style.height = document.querySelector('#main').offsetHeight- document.querySelector('.toolbar-wrapper').offsetHeight+'px';
  },
  getCurrentLayer: function(){
    return this.state.currentlayer;
  },
  getCurrentImg: function(layer){
    if(layer.children[0].nodeType=='Group'){
      var g = layer.children[0];
      var arrChildren = g.children;
      for(var i = 0, len = arrChildren.length; i < len; i++) {
        var children = arrChildren[i];
        if(children.getName() == 'image') return children;
      }
    }
  },
  setCurrentLayer: function(l,callback){
    this.setState({currentlayer:l},function(){
      if(typeof callback=='function')callback();
    });
  },
  appRemoveLayer: function(layer,callback){
    var $t = this;
    var arr = [];
    console.log(layer.length);
    if(layer.length==undefined){
      arr = this.state.layers.filter(function(l) {
        return l.key !== layer.key;
      });
      this.setState({layers:arr},function(){
        if(typeof callback=='function')callback();
      });
    }else{
      var a = this.state.layers;
      for(var i=0,l=layer.length;i<l;i++){
        for(var x=a.length-1;x>=0;x--){
          if(layer[i].key==a[x].key){
            a.splice(x,1);
          }
        }
      }
      this.setState({layers:a},function(){
        if(typeof callback=='function')callback();
      });
    }
  },
  appToBack: function(e){
    var layer = this.getCurrentLayer();
    if(layer!==null){
      layer.moveDown();
      var arr = this.state.layers;
      for(var obj in arr) {
        if(obj.key == layer.key) {
          obj = layer;
          break;
        }
      }
      this.setState({layers:arr},function(){
        this.props.onUpdate();
      });
    }
  },
  appToFront: function(e){
    var layer = this.getCurrentLayer();
    if(layer!==null){
      layer.moveUp();
      var arr = this.state.layers;
      for(var obj in arr) {
        if(obj.key == layer.key) {
          obj = layer;
          break;
        }
      }
      this.setState({layers:arr},function(){
        this.props.onUpdate();
      });
    }
  },
  appToTop: function(e){
    var layer = this.getCurrentLayer();
    if(layer!==null){
      layer.moveToTop();
      var arr = this.state.layers;
      for(var obj in arr) {
        if(obj.key == layer.key) {
          obj = layer;
          break;
        }
      }
      this.setState({layers:arr},function(){
        this.props.onUpdate();
      });
    }
  },
  appToBottom: function(e){
    var layer = this.getCurrentLayer();
    if(layer!==null){
      layer.moveToBottom();
      var arr = this.state.layers;
      for(var obj in arr) {
        if(obj.key == layer.key) {
          obj = layer;
          break;
        }
      }
      this.setState({layers:arr},function(){
        this.props.onUpdate();
      });
    }
  },
  appZoomIn: function(e){
    var z = this.state.zoom;
    if(e.shiftKey){
      this.setState({zoom:100});
    }else{
      this.setState({zoom:(z+1)});
    }
  },
  appZoomOut: function(e){
    var z = this.state.zoom;
    if(e.shiftKey){
      var viewstage = this.getCurrentInstance();
      var w = viewstage.offsetWidth,
          h = viewstage.offsetHeight,
          ow = KineticStage.width(),
          oh = KineticStage.height();
      if(ow<=w&&oh<=h){
        this.setState({zoom:(z-1)});
      }else{
        var r = ow/oh,
            rz = 100;
        if(r<=1){
          var nh = oh*w/ow;
          rz = nh/oh*100;
        }else{
          var nw = ow*h/oh;
          rz = nw/ow*100;
        }
        this.setState({zoom:rz});
      }
    }else{
      this.setState({zoom:(z-1)});
    }
  },
  setOpacity: function(v){
    if(this.state.layers.length){
      hideWrap();
      var layer = this.getCurrentLayer();
      layer.setOpacity(v);
      KineticStage.draw();
    }
  },
  blend: function(mode,layers,callback){
    var $this = this,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        ow = KineticStage.width(),
        oh = KineticStage.height(),
        lr = [];
      
    for(var i=0,len=layers.length;i<len;i++){
      var layer = layers[i].props['data-ref'];
      if(layer.children[0].nodeType=='Group'){
        var g = layer.children[0],
            pos = g.attrs;
        if(pos.x==undefined)pos.x=0;
        if(pos.y==undefined)pos.y=0;
        var arrChildren = g.children;
        for(var x = 0, len2 = arrChildren.length; x < len2; x++) {
          var children = arrChildren[x];
          if(children.getName() == 'image') {
            var lw = layer.width(),
                lh = layer.height(),
                iw = children.attrs.width,
                ih = children.attrs.height,
                sw = lw,
                sh = lh;
            if(iw>lw){
              sw = iw;
            }
            if(ih>lh){
              sh = ih;
            }
            KineticStage.setSize({
              width:sw,
              height:sh
            });
            KineticStage.draw();

            if(i==0){
              canvas.width = children.attrs.width;
              canvas.height = children.attrs.height;
              ctx.save();        
            }
            
            var src = layer.getCanvas()._canvas;
            ctx.drawImage(src,pos.x,pos.y,children.attrs.width,children.attrs.height,0,0,children.attrs.width,children.attrs.height);
            
            if(i==0)ctx.globalCompositeOperation = mode;

            var name = mode+'---'+layer.layername;
            lr.push(layer);
            layer.remove();  

            if(i==len-1){
              var opt = {};
              opt.x = pos.x;
              opt.y = pos.y;
              opt.draggable = true;
              opt.zindex = layer.index;
              $this.appDrawImage(canvas,name,opt,function(l){
                KineticStage.width(ow);
                KineticStage.height(oh);
                $this.appRemoveLayer(lr,function(){
                  $this.setCurrentLayer(l);
                  $this.props.onDraw($this.state.layers,function(){
                    $this.props.onUpdate();
                  });
                  if(typeof callback=='function')callback();
                });
              });
            }
          }
        }
      }
    }
  },
  setZIndex: function(l,v){
    l.setZIndex(v);
    KineticStage.draw();
  },
  appTransform: function(){
    if(this.state.layers.length){
      var layer = this.getCurrentLayer();
      showWrap(layer);
    }
  },
  appFilter: function(filter,callback){
    if(this.state.layers.length&&filter!==''){
      hideWrap();
      var layer = this.getCurrentLayer();
      var g = layer.children[0];
      var img = this.getCurrentImg(layer);
      g.setX(0);
      g.setY(0);
      img.setX(0);
      img.setY(0);
      var config = {
        x:0,
        y:0,
        width: img.attrs.width,
        height: img.attrs.height
      }
      layer.cache(config);
      var arr = layer.filters()!==undefined?layer.filters():[];
      arr.push(Kinetic.Filters[filter]);
      layer.filters(arr);
      KineticStage.draw();
      if(typeof callback === 'function') callback();
    }
  },
  appFilterOption: function(setting,value){
    if(this.state.layers.length){
      var layer = this.getCurrentLayer();
      layer[setting](value);
      KineticStage.draw();
    }
  },
  appDrawImage: function(src,name,opt,callback){
    //add layer when draw image
    var cs;
    if(typeof src=='string'){
      cs=src;
    }else{
      if(src.nodeName==undefined){
        cs = null;
      }else {
        if(src.nodeName.toLowerCase()=='canvas'){
          cs = src.toDataURL();
        }
        if(src.nodeName.toLowerCase()=='img'){
          cs = src.src;
        }
      }
        
    }
    var img = new Image();
    var imgR,
        $this = this;
    var x = (opt.x!==null)? opt.x:0,
        y = (opt.y!==null)? opt.y:0;
    if(cs==null){
      img = src.attrs.image;
      imgR=drawImage(img, x, y, img.width, img.height,opt.zindex, opt.draggable);
      if(imgR.parent && imgR.parent.nodeType=='Layer'){
        var layer = {}, arr = $this.state.layers;
        layer = imgR.parent;
        layer.key = name;
        layer.layername = name;
        arr.push(layer);
        $this.setState({layers:arr},function(){
          $this.props.onDraw($this.state.layers);
          if(typeof callback =='function') callback(layer);
        });
      }
    }else{
      img.onload = function() {
        imgR=drawImage(this, x, y, img.width, img.height,opt.zindex, opt.draggable);
        if(imgR.parent && imgR.parent.nodeType=='Layer'){
          var layer = {}, arr = $this.state.layers;
          layer = imgR.parent;
          layer.key = name;
          layer.layername = name;
          arr.push(layer);
          $this.setState({layers:arr},function(){
            $this.props.onDraw($this.state.layers);
            if(typeof callback =='function') callback(layer);
          });
        }
      }
      img.src = cs;
    }
  },
  saveApplyFilter: function(){
    if(this.state.layers.length){
      hideWrap();
      var $this = this;
      var layer = this.getCurrentLayer();
      if(layer.children[0].nodeType=='Group'){
        var g = layer.children[0],
            pos = g.attrs;
        if(pos.x==undefined)pos.x=0;
        if(pos.y==undefined)pos.y=0;
        var arrChildren = g.children;
        for(var i = 0, len = arrChildren.length; i < len; i++) {
            var children = arrChildren[i];
            if(children.getName() == 'image') {
              //compare image and stage/layer
              var lw = layer.width(),
                  lh = layer.height(),
                  iw = children.attrs.width,
                  ih = children.attrs.height,
                  sw = lw,
                  sh = lh;
              if(iw>lw){
                sw = iw;
              }
              if(ih>lh){
                sh = ih;
              }
              KineticStage.setSize({
                width:sw,
                height:sh
              });
              KineticStage.draw();

              var canvas = document.createElement('canvas');
              canvas.width = children.attrs.width;
              canvas.height = children.attrs.height;
              var ctx = canvas.getContext('2d');
              var src = layer.getCanvas()._canvas;
              ctx.drawImage(src,pos.x,pos.y,children.attrs.width,children.attrs.height,0,0,children.attrs.width,children.attrs.height);
              
              var name = layer.layername;
              $this.appRemoveLayer(layer);
              layer.remove();
              var opt = {};
              opt.x = pos.x;
              opt.y = pos.y;
              opt.draggable = true;
              opt.zindex = layer.index;
              $this.appDrawImage(canvas,name,opt,function(){
                if(iw>lw)KineticStage.width(lw);
                if(ih>lh)KineticStage.height(lh);
              });
            }
        }
      }
    }
  },
  cancelFilter: function(){
    if(this.state.layers.length){
      var layer = this.getCurrentLayer();
      var g = layer.children[0];
      var img = this.getCurrentImg(layer);
      g.setX(0);
      g.setY(0);
      img.setX(0);
      img.setY(0);
      var config = {
        x:0,
        y:0,
        width: img.attrs.width,
        height: img.attrs.height
      }
      layer.cache(config);
      layer.filters([]);
      KineticStage.draw();
      if(typeof callback === 'function') callback();
    }
  },
  resetFilter: function(){
    if(this.state.layers.length){
      var layer = this.getCurrentLayer();
      //TODO
    }
  },
  openFile: function(files,callback){
    var file = files[0];
    var $this = this;
    var isPhone = this.props.mobileMode,
        reader  = new FileReader(),
        canvas  = null,
        drawOpt = {};
    reader.addEventListener("load", function () {
      if(isPhone){
        var imgT = new Image();
        var canvast = document.createElement('canvas');
        var ctx = canvast.getContext('2d');
        imgT.onload = function(){
          canvast.width = imgT.width;
          canvast.height = imgT.height;
          ctx.save();
          var width  = canvast.width;  
          var styleWidth  = canvast.style.width;
          var height = canvast.height; 
          var styleHeight = canvast.style.height;
          EXIF.getData(this,function() {
              var orientation = EXIF.getTag(this,"Orientation");
              if (orientation > 4) {
                  canvast.width  = height; canvast.style.width  = styleHeight;
                  canvast.height = width;  canvast.style.height = styleWidth;
              }
              switch(orientation){
                  case 2:
                      // horizontal flip
                      ctx.translate(canvast.width, 0);
                      ctx.scale(-1, 1);
                      break;
                  case 3:
                      // 180° rotate left
                      ctx.translate(canvast.width, canvast.height);
                      ctx.rotate(Math.PI);
                      break;
                  case 4:
                      // vertical flip
                      ctx.translate(0, canvast.height);
                      ctx.scale(1, -1);
                      break;
                  case 5:
                      // vertical flip + 90 rotate right
                      ctx.rotate(0.5 * Math.PI);
                      ctx.scale(1, -1);
                      break;
                  case 6:
                      // 90° rotate right
                      ctx.rotate(0.5 * Math.PI);
                      ctx.translate(0, -height);
                      break;
                  case 7:
                      // horizontal flip + 90 rotate right
                      ctx.rotate(0.5 * Math.PI);
                      ctx.translate(canvast.width, -canvast.height);
                      ctx.scale(-1, 1);
                      break;
                  case 8:
                      // 90° rotate left
                      ctx.rotate(-0.5 * Math.PI);
                      ctx.translate(-canvast.width, 0);
                      break;
              }
              ctx.drawImage(imgT,0,0);
              ctx.restore();
              var image = new Image();
              image.onload = function(){
                $this.createNewFile(image.width,image.height,'#none',function(){
                  drawOpt.draggable = true;
                  drawOpt.zindex = 1;
                  $this.appDrawImage(image,file.name,drawOpt,function(){
                    console.log($this.state.layers);
                    $this.setState({currentlayer:$this.state.layers[0]},function(){
                      console.log('aaa');
                    });
                  });
                });
                if(typeof callback === 'function') callback();
              }
              image.src = canvast.toDataURL();
          });
        }
        imgT.src = this.result;
      }else{
        var image = new Image();
        image.onload = function(){
          var opt = {
            width:image.width,
            height:image.height,
            background:'#none'
          }
          $this.createNewFile(opt,function(){
            drawOpt.draggable = true;
            drawOpt.zindex = 1;
            $this.appDrawImage(image,file.name,drawOpt,function(){
              $this.setState({currentlayer:$this.state.layers[0]},function(){
              });
            });
          });
          if(typeof callback === 'function') callback();
        }
        image.src = this.result;
      }
    }, false);
    reader.readAsDataURL(file);
  },
  createNewFile: function(opt,callback){
    var dOpt = {'width':500,'height':500,'background':'#none'};
    opt = $.extend(dOpt,opt);
    var $this = ReactDOM.findDOMNode(this);
    var canvasW = $this.offsetWidth,
        canvasH = $this.offsetHeight;
    var savew = opt.width,
        saveh = opt.height;
    var cx = savew / 2,
        cy = saveh / 2;
    KineticStage = new Kinetic.Stage({
        container: "savestage",
        width: savew,
        height: saveh
    });
    if(opt.background!=='#none'){
      var stageBg = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: KineticStage.getWidth(),
        height: KineticStage.getHeight(),
        fill: opt.background
      });
      var layer = new Kinetic.Layer();
      layer.add(stageBg);
      KineticStage.add(layer);
    }
    if(typeof callback ==='function')callback();
  },
  saveFile: function(opt){
  },
  appExportFile: function(callback){
    if(KineticStage==undefined)return;
    var $this = this,
        photo = {};
    KineticStage.toDataURL({
      callback: function(dataURL){
        photo.data = dataURL;
        $.ajax({
          url: $this.props.url,
          type: 'POST',
          data: photo,
          success: function(data) {
            $this.setState({data: photo});
            $this.setState({result: data.photoURL});
          }.bind($this),
          error: function(xhr, status, err) {
            console.error($this.props.url, status, err.toString());
          }.bind($this),
          complete: function(){
            var img = new Image();
            img.onload = function(){
              if(typeof callback === 'function') callback();
              var obj = null;
              obj =  (<BoostrapImage className="img-result" src={img.src}></BoostrapImage>);
              $this.props.onMessage(obj,function(){});
            }
            img.src = $this.state.result; 
          }.bind($this)
        });
      }
    });
  },
  render: function() {
    var stageStyle = {
      WebkitTransform:'scale3d('+this.state.zoom/100+','+this.state.zoom/100+','+'1)',
      transform: 'scale3d('+this.state.zoom/100+','+this.state.zoom/100+','+'1)'
    };
    return (
      <div id="stage" className="stage-wrapper">
          <div id="savestage" style={stageStyle}></div>
      </div>
    );
  }
});
ReactDOM.render(
  <DrawAppBox fileImported={[]} fileEdited={[]} fileSelects={[]} fileCurrentSelect={[]} mobileMode={$('html').hasClass('isMobile')? true:false}/>,
  document.getElementById('main')
);