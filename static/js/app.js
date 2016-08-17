'use strict';
const AppToolButtons = [
  {title:"New File",icon:"fa-file",method:"newFile",group:"btn-group-file"},
  {title:"Save File",icon:"fa-save",method:"saveFile",group:"btn-group-file"},
  {title:"Open File",icon:"fa-folder-open",method:"openFile",group:"btn-group-file"},
  {title:"Export File",icon:"fa-cloud-upload",method:"exportImage",group:"btn-group-file"},
  {title:"Undo",icon:"fa-undo",method:"appUnDo",group:"btn-group-command"},
  {title:"Redo",icon:"fa-repeat",method:"appReDo",group:"btn-group-command"},
  {title:"Erase",icon:"fa-eraser",method:"appErase",group:"btn-group-command"},
  {title:"Trash",icon:"fa-trash",method:"appTrash",group:"btn-group-command"},
  {title:"Zoom In",icon:"fa-search-plus",method:"appZoomIn",group:"btn-group-command"},
  {title:"Zoom Out",icon:"fa-search-minus",method:"appZoomOut",group:"btn-group-command"},
  {title:"Insert Photo",icon:"fa-file-photo-o",method:"openModalPhoto",group:"btn-group-photo"},
  {title:"Blend",icon:"fa-filter",method:"appOpenFilter",group:"btn-group-photo"}
];
const AppFilterPreset =[
  {title:"Juno",img:""},
  {title:"Juno",img:""}
];
//top-left, top, top-right, right, bottom-right, bottom, bottom-left or left
const AppFilterObject = [
  {title:"Grayscale",method:"Grayscale"},
  {title:"Brighten",method:"Brighten",option:[{type:"range",title:"Brightness",properties:{min:-1,max:1,step:0.1,value:0,config:"brightness"}}]},
  {title:"Invert",method:"Invert"},
  {title:"Blur",method:"Blur",option:[{type:"range",title:"Radius",properties:{min:0,max:100,step:1,value:10,config:"blurRadius"}}]},
  {title:"Mask",method:"Mask",option:[{type:"range",title:"Threshold",properties:{min:0,max:500,step:1,config:"threshold"}}]},
  {title:"RGB",method:"RGB",option:[{type:"range",title:"Red",properties:{min:0,max:255,step:1,value:125,config:"red"}},{type:"range",title:"Green",properties:{min:0,max:255,step:1,value:125,config:"green"}},{type:"range",title:"Blue",properties:{min:0,max:255,step:1,value:125,config:"blue"}}]},
  {title:"HSV",method:"HSV",option:[{type:"range",title:"Hue",properties:{min:0,max:359,step:1,value:0,config:"hue"}},{type:"range",title:"Saturation",properties:{min:-1,max:1,step:0.1,value:0,config:"saturation"}},{type:"range",title:"Value",properties:{min:-1,max:1,step:0.1,value:0,config:"value"}}]},
  {title:"HSL",method:"HSL",option:[{type:"range",title:"Hue",properties:{min:0,max:359,step:1,value:0,config:"hue"}},{type:"range",title:"Saturation",properties:{min:-1,max:1,step:0.1,value:0,config:"saturation"}},{type:"range",title:"Luminance",properties:{min:-1,max:1,step:0.1,value:0,config:"luminance"}}]},
  {title:"Emboss",method:"Emboss",option:[
    {type:"range",title:"Strength",properties:{min:0,max:1,step:0.1,value:0.5,config:"embossStrength"}},
    {type:"range",title:"WhiteLevel",properties:{min:-1,max:1,step:0.1,value:0.5,config:"embossWhiteLevel"}},
    {type:"select",title:"Direction",properties:{value:'top-left',config:"embossDirection"},options:['top-left','top','top-right','right','bottom-right','bottom','bottom-left','left']},
    {type:"range",title:"Blend",properties:{min:0,max:10,step:1,value:0,config:"embossBlend"}}]},
  {title:"Enhance",option:[{type:"range",title:"Enhance",properties:{min:0,max:255,step:1,value:0,config:"enhance"}}]}
];
var jcrop_api;
window.originalIMG = [];

const DrawAppBox = React.createClass({
  getInitialState: function() {
    return {message:null};
  },
  componentDidMount: function() {
    this.refs.panelmanual.setStage(this.refs.appstage);
  },
  componentWillUnmount: function(){
    console.log('AppBox componentWillUnmount');
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
    $this.refs.appstage.loadFile(files,function(){
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
    if(this.props.fileSelects.length<=0){
        bootbox.alert('You need select at least 1 photo');
        return;
    }
    var $this = this;
    for(var i=0,len=this.props.fileSelects.length;i<len;i++){
      this.handleLoadPhoto(this.props.fileSelects[i],function(){
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
    var cans = $('#editArea').find('canvas');
    for(var i=0,len=cans.length;i<len;i++){
      this.props.fileImported.push(cans[i]);
      var drawOpt = {};
      drawOpt.draggable = true;
      drawOpt.zindex = i+1;
      this.refs.appstage.appDrawImage(cans[i],drawOpt);
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
            });
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
                $this.props.fileEdited.push(item);
                if($this.props.fileEdited.length==$this.props.fileSelects.length){
                  if(typeof callback==='function'){
                    callback();
                  }
                }
            }
            image.src = canvast.toDataURL();
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
          //a.attr('data-name',file.name).append(image).append('<label><i class="fa fa-arrows-alt"></i><i class="fa fa-crop"></i></label>');
          item.img = image;
          item.canvas = canvas;
          $this.props.fileEdited.push(item);
          if($this.props.fileEdited.length==$this.props.fileSelects.length){
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
    //console.log(can);
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
  handleZoomIn: function(e){
    this.refs.appstage.appZoomIn(e);
  },
  handleZoomOut: function(e){
    this.refs.appstage.appZoomOut(e);
  },
  handleExportPhoto: function(){
    var $this = this;
    $this.showLoading();
    this.refs.appstage.exportFile(function(){
      $this.hideLoading();
    });
  },
  render: function() {
    var $this = this;
    var modal = null;
    modal = (
      <AppModal ref="modal" confirm="OK" cancel="Cancel" onCancel={this.handleFileModalCancel} onConfirm={this.confirmFileModal} id="fileModal" title="ReactPhotoEdito - Add Photos">
        <AppUpload fileSelects={this.props.fileSelects}></AppUpload>
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
            <BootstrapInput className="form-control" placeholder="width" type="number" min="50" max="10000"></BootstrapInput>
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
      <AppBottomPanel ref="panelmanual" items={AppFilterObject} className="manual-filters" id="panelManualEffect"></AppBottomPanel>
    );
    return (
      <div className="main-app">
        <AppToolbar buttons={AppToolButtons} exportFile={this.handleExportPhoto} openFileModal={this.openFileModal} loadFile={this.loadFile} newFile={this.openNewFileModal} openJCrop={this.openCropFileModal} zoomIn={this.handleZoomIn} zoomOut={this.handleZoomOut} openEffectPanel={this.openEffectPanel} />
        <AppStage ref="appstage" mobileMode={this.props.mobileMode} url="/api/photo" onMessage={this.showMessage}/>
        <BootstrapInput type="file" className="file-dialog" id="fileDialog" onChange={this.handleOpenFile}></BootstrapInput>
        {modal}
        {modalEditPhoto}
        {modalNew}
        {modalJcrop}
        {modalMessage}
        {panelManualFilter}
        <BootstrapLoading ref="apploading"></BootstrapLoading>
      </div>
    );
  }
});

const AppToolbarButton = React.createClass({
  componentDidMount: function() {
    
  },
  openModalPhoto: function(){
    /*var parent = this._reactInternalInstance._currentElement._owner._instance;*/
    if(typeof this.props.openFileModal==='function'){
      this.props.openFileModal();
    }
  },
  newFile: function(){
    if(typeof this.props.newFile==='function'){
      this.props.newFile();
    }
  },
  loadFile: function(){
    if(typeof this.props.loadFile==='function'){
      this.props.loadFile();
    }
  },
  zoomIn: function(e){
    if(typeof this.props.zoomIn==='function'){
      this.props.zoomIn(e);
    }
  },
  zoomOut: function(e){
    if(typeof this.props.zoomOut==='function'){
      this.props.zoomOut(e);
    }
  },
  openFilter: function(e){
    if(typeof this.props.openFilter==='function'){
      this.props.openFilter(e);
    }
  },
  exportFile: function(e){
    if(typeof this.props.exportFile==='function'){
      this.props.exportFile(e);
    }
  },
  handleClick: function(e){
    var method = this.props.button.method;
    switch(method){
      case 'openModalPhoto':
        this.openModalPhoto();
        break;
      case 'newFile':
        this.newFile();
        break;
      case 'openFile':
        this.loadFile();
        break;
      case 'appZoomIn':
        this.zoomIn(e);
        break;
      case 'appZoomOut':
        this.zoomOut(e);
        break;
      case 'appOpenFilter':
        this.openFilter(e);
        break;
      case 'exportImage':
        this.exportFile(e);
        break;
      default:
        break;
    }
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
  render: function() {
    var btns = [],
        currentIndex = 0;
    this.props.buttons.forEach(function(button) {
      btns.push(<AppToolbarButton button={button} key={this.props.groupid + '_' + currentIndex} exportFile={this.props.exportFile} openFilter={this.props.openFilter} zoomIn={this.props.zoomIn} zoomOut={this.props.zoomOut} loadFile={this.props.loadFile} newFile={this.props.newFile} openFileModal={this.props.openFileModal}/>);
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
  render: function() {
    var groups = [],
        grouparr = [],
        currentGroup = this.props.buttons[0].group,
        currentIndex = 1;
    this.props.buttons.forEach(function(button,index) {
      if(button.group==currentGroup){
        grouparr.push(button);
      }else{
        groups.push(<AppToolbarGroup buttons={grouparr} key={currentIndex} groupid={currentIndex} exportFile={this.props.exportFile} openFilter={this.props.openEffectPanel} zoomIn={this.props.zoomIn} zoomOut={this.props.zoomOut} loadFile={this.props.loadFile} newFile={this.props.newFile} openFileModal={this.props.openFileModal}/>);
        grouparr = [];
        currentIndex++;
        grouparr.push(button);
      }
      currentGroup = button.group;
      if(index==this.props.buttons.length-1)groups.push(<AppToolbarGroup buttons={grouparr} key={currentIndex} groupid={currentIndex} exportFile={this.props.exportFile} openFilter={this.props.openEffectPanel} zoomIn={this.props.zoomIn} zoomOut={this.props.zoomOut} loadFile={this.props.loadFile} newFile={this.props.newFile} openFileModal={this.props.openFileModal}/>);
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
const AppBottomPanel = React.createClass({
  getInitialState: function(){
    return {
      isOpening:false,
      appstage:null
    }
  },
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
  setStage:function(stage){
    this.setState({appstage:stage});
  },
  close: function() {
    this.setState({isOpening:false});
  },
  open: function() {
    this.setState({isOpening:true});
  },
  getInstance: function(){
    return $(this.refs.root);
  },
  handleChange: function(e){
    if(this.state.appstage==null)return;
    var method = e.target.value;
    this.state.appstage.appFilter(method);
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
    if(this.state.appstage==null)return;
    this.state.appstage.appFilterOption(method,e.target.value);
  },
  render: function() {
    var $this = this;
    var classes = (this.state.isOpening)?'show ':'';
    classes+=this.props.className;
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
      <div ref="root" className={classes + ' panel panel-success bottom-panel'} id={this.props.id}>
        <div className="panel-heading">
          <h3 className="panel-title">Effects</h3>
        </div>
        <div className="form-group">
          <select className="form-control" id={'select_'+this.props.id} onChange={this.handleChange}>{items}</select>
          {options}
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
      isFull:false,
      isHasFile:false
    };
  },
  parseFile: function (file){
    this.props.fileSelects.push(file);
    if(this.props.fileSelects.length){
      this.setState({
        isHasFile:true
      });
    }
    if(this.props.fileSelects.length>=8){
      this.setState({
        isFull:true
      });
    }
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
      if(this.props.fileSelects.length>=max_upload)return;
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
    var classes = this.state.isFull ? "full" : "";
    return(
      <div className={classes + ' upload-area'}>
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
                  //console.log(e.shiftKey);
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
const AppStage = React.createClass({
  getCurrentInstance: function(){
    return ReactDOM.findDOMNode(this);
  },
  getInitialState: function() {
    return {zoom:100,data:null,result:null};
  },
  componentDidMount: function(){
    var $this = ReactDOM.findDOMNode(this);
    $this.style.height = document.querySelector('#main').offsetHeight- document.querySelector('.toolbar-wrapper').offsetHeight+'px';
  },
  getCurrentLayer: function(){
    return window.originalIMG[0];
  },
  appZoomIn: function(e){
    var z = this.state.zoom;
    if(e.shiftKey){
      var viewstage = this.getCurrentInstance();
      var w = viewstage.offsetWidth,
          h = viewstage.offsetHeight,
          ow = KineticStage.width(),
          oh = KineticStage.height();
      if(ow<=w&&oh<=h){
        this.setState({zoom:(z+1)});
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
  appFilter: function(filter,callback){
    if(window.originalIMG.length){
      var layer = this.getCurrentLayer();
      var config = {
        x:0,
        y:0,
        width: layer.width(),
        height: layer.height()
      }
      layer.cache(config);
      layer.filters([Kinetic.Filters[filter]]);
      KineticStage.draw();
      if(typeof callback === 'function') callback();
    }
  },
  appFilterOption: function(setting,value){
    if(window.originalIMG.length){
      var layer = this.getCurrentLayer();
      layer[setting](value);
      KineticStage.draw();
    }
  },
  appDrawImage: function(src,opt){
    var cs;
    if(typeof src=='string'){
      cs=src;
    }else{
      if(src.nodeName.toLowerCase()=='canvas'){
        cs = src.toDataURL();
      }
      if(src.nodeName.toLowerCase()=='img'){
        cs = src.src;
      }
    }
    var img = new Image();
    var imgR;
    img.onload = function() {
      imgR=drawImage(this, 0, 0, img.width, img.height,opt.zindex, opt.draggable);
      imgR.key = window.originalIMG.length;
      window.originalIMG.push(imgR);
    }
    img.src = cs;
  },
  loadFile: function(files,callback){
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
                  drawOpt.draggable = false;
                  drawOpt.zindex = 1;
                  $this.appDrawImage(image,drawOpt);
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
            drawOpt.draggable = false;
            drawOpt.zindex = 1;
            $this.appDrawImage(image,drawOpt);
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
  exportFile: function(callback){
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
      zoom: (this.state.zoom/100)
    };
    return (
      <div id="stage" className="stage-wrapper">
          <div id="savestage" style={stageStyle}></div>
      </div>
    );
  }
});
ReactDOM.render(
  <DrawAppBox fileImported={[]} fileEdited={[]} fileSelects={[]} mobileMode={$('html').hasClass('isMobile')? true:false}/>,
  document.getElementById('main')
);