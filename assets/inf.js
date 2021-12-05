let absWidth;
let absHeight;

let previewInit = false;
let spiralSide = null;
let currentColor = '#ffffff';

let iconess = document.querySelector('.fs_icon').src = 'fs_in.svg';

function initResize() {
	absWidth = document.getElementById('box').offsetWidth;
	absHeight = document.getElementById('box').offsetHeight;
	infBox.style.width = absWidth + 'px';
	infBox.style.height = absHeight + 'px';
}

function removeInf() {
	$('#infBox').html('');
	spiralSide = null;
}

function animated(type,side,count) {
	$('#infBox').html('');
	$('#infBox').removeAttr('style');
	$('#infBox').css('overflow','hidden');
	if(type == 'spiral') {
		let elem = document.createElement('canvas');
		elem.id = 'mainSpiral';
		elem.width = window.innerWidth*1.2;
		elem.height = window.innerWidth*1.2;
		elem.style.width = window.innerWidth*1.2;
		elem.style.height = window.innerWidth*1.2;
		elem.style.position = 'absolute';
		elem.style.transform = 'scale(1.5)';
		$('#infBox').css('display','flex');
		$('#infBox').css('justify-content','center');
		$('#infBox').css('align-items','center');
		document.getElementById('infBox').appendChild(elem);
		spiralSide = side;
		initSpiral('mainSpiral',side);
	} else {
		spiralSide = null;
		let file = type == 'romb' ? 'png' : 'svg';
		for(let i = 0; i < count; i++) {
			let elem = document.createElement('img');
			elem.type = 'image/svg+xml';
			elem.src = 'animations/' + type + '.' + file;
			elem.className = 'anim-inf anim-' + type + '-' + side;
			elem.style.position = 'absolute';
			elem.style.animationDelay = i + 's';
			elem.style.width = '220%';
			elem.style.opacity = infOpacity;
			document.getElementById('infBox').appendChild(elem);
		}
	}
	$('#infModal').removeClass('is-active');
	initResize();
}
function hex2hsl(hex,opacity) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  console.log('hsl(' + Math.round(360*h) + ',' + Math.round(s*100) + ',' + Math.round((1-opacity)*100) + ')')
  return 'hsl(' + Math.round(360*h) + ',' + Math.round(s*100) + '%,' + Math.round((1-opacity)*100) + '%)';
}

function initPreviewSpiral(bypass) {
	if(!previewInit || bypass) {
		initSpiral('previewSpiralLeft',1,true, bypass);
		initSpiral('previewSpiralRight',0,true, bypass);
		previewInit = true;
	}
}

function initSpiral(id,side,preview, bypass) {
	if(preview) {
		if(!previewInit || bypass) {
			let rotate = side == 1 ? 'spiral-l' : 'spiral-r';
			var c = document.getElementById(id);
			c.style.animation = rotate + ' 1s infinite linear';
			c.style.position = 'absolute'
			let box = document.getElementById('ctxBox');
			c.width = box.offsetWidth*1.2;
			c.height = box.offsetWidth*1.2;
			c.style.width = box.offsetWidth*1.2 + 'px';
			c.style.height = box.offsetWidth*1.2 + 'px';
			var centerX = c.offsetWidth/2;
			var centerY = c.offsetWidth/2;
			var cxt = c.getContext("2d");
			cxt.clearRect(0,0,$('#' + id).outerWidth(),$('#' + id).outerHeight());
			let rgb = 255*(1-infOpacity);
			cxt.fillStyle = currentColor;
			cxt.strokeStyle = hex2hsl(currentColor,infOpacity);
			cxt.fillRect(0,0,box.offsetWidth*1.2,box.offsetWidth*1.2);
			cxt.moveTo(centerX, centerY);

			var STEPS_PER_ROTATION = 60;
			var increment = Math.PI / STEPS_PER_ROTATION;
			var theta = increment;

			while (theta < 40 * Math.PI) {
				var newX = centerX + theta * Math.cos(theta);
				var newY = centerY + theta * Math.sin(theta);
				cxt.lineTo(newX, newY);
				theta = theta + increment;
			}

			cxt.stroke();
		}
	} else {
		let rotate = side == 1 ? 'spiral-l' : 'spiral-r';
		var c = document.getElementById(id);
		c.style.animation = rotate + ' 0.5s infinite linear';
		var centerX = c.offsetWidth/2;
		var centerY = c.offsetWidth/2;
		var cxt = c.getContext("2d");
		cxt.clearRect(0,0,$('#' + id).outerWidth(),$('#' + id).outerHeight());
		cxt.lineWidth = 10;
		let rgb = 255*(1-infOpacity);
		cxt.fillStyle = currentColor;
		cxt.strokeStyle = hex2hsl(currentColor,infOpacity);
		//cxt.fillRect(0,0,mainBox.offsetWidth*2,mainBox.offsetWidth*2);
		cxt.moveTo(centerX, centerY);

		var STEPS_PER_ROTATION = 60;
		var increment = Math.PI / STEPS_PER_ROTATION;
		var theta = increment;

		while (theta < 150 * Math.PI) {
			var newX = centerX + theta*6 * Math.cos(theta);
			var newY = centerY + theta*6 * Math.sin(theta);
			cxt.lineTo(newX, newY);
			theta = theta + increment;
		}

		cxt.stroke();
		//$("#currentBlock").css("background-color",currentColor);
	}
}

// let absWidth;
// let absHeight;

// let previewInit = false;
// let spiralSide = null;
// let currentColor = '#ffffff';

// function initResize() {
// 	absWidth = document.getElementById('box').offsetWidth;
// 	absHeight = document.getElementById('box').offsetHeight;
// 	infBox.style.width = absWidth + 'px';
// 	infBox.style.height = absHeight + 'px';
// }

// function removeInf() {
// 	document.querySelector('#infBox').html('');
// 	spiralSide = null;
// }

// function animated(type,side,count) {
// 	document.querySelector('#infBox').html('');
// 	document.querySelector('#infBox').removeAttr('style');
// 	document.querySelector('#infBox').css('overflow','hidden');
// 	if(type == 'spiral') {
// 		let elem = document.createElement('canvas');
// 		elem.id = 'mainSpiral';
// 		elem.width = window.innerWidth*1.2;
// 		elem.height = window.innerWidth*1.2;
// 		elem.style.width = window.innerWidth*1.2;
// 		elem.style.height = window.innerWidth*1.2;
// 		elem.style.position = 'absolute';
// 		elem.style.transform = 'scale(1.5)';
// 		document.querySelector('#infBox').css('display','flex');
// 		document.querySelector('#infBox').css('justify-content','center');
// 		document.querySelector('#infBox').css('align-items','center');
// 		document.getElementById('infBox').appendChild(elem);
// 		spiralSide = side;
// 		initSpiral('mainSpiral',side);
// 	} else {
// 		spiralSide = null;
// 		let file = type == 'romb' ? 'png' : 'svg';
// 		for(let i = 0; i < count; i++) {
// 			let elem = document.createElement('img');
// 			elem.type = 'image/svg+xml';
// 			elem.src = 'animations/' + type + '.' + file;
// 			elem.className = 'anim-inf anim-' + type + '-' + side;
// 			elem.style.position = 'absolute';
// 			elem.style.animationDelay = i + 's';
// 			elem.style.width = '220%';
// 			elem.style.opacity = infOpacity;
// 			document.getElementById('infBox').appendChild(elem);
// 		}
// 	}
// 	document.querySelector('#infModal').removeClass('is-active');
// 	initResize();
// }
// function hex2hsl(hex,opacity) {
//   var result = /^#?([a-fd]{2})([a-fd]{2})([a-fd]{2})$/i.exec(hex);
//     r = parseInt(result[1], 16);
//     g = parseInt(result[2], 16);
//     b = parseInt(result[3], 16);
//     r /= 255, g /= 255, b /= 255;
//     var max = Math.max(r, g, b), min = Math.min(r, g, b);
//     var h, s, l = (max + min) / 2;
//     if(max == min){
//       h = s = 0; // achromatic
//     }else{
//       var d = max - min;
//       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//       switch(max){
//         case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//         case g: h = (b - r) / d + 2; break;
//         case b: h = (r - g) / d + 4; break;
//       }
//       h /= 6;
//     }
//   console.log('hsl(' + Math.round(360*h) + ',' + Math.round(s*100) + ',' + Math.round((1-opacity)*100) + ')')
//   return 'hsl(' + Math.round(360*h) + ',' + Math.round(s*100) + '%,' + Math.round((1-opacity)*100) + '%)';
// }

// function initPreviewSpiral(bypass) {
// 	if(!previewInit || bypass) {
// 		initSpiral('previewSpiralLeft',1,true, bypass);
// 		initSpiral('previewSpiralRight',0,true, bypass);
// 		previewInit = true;
// 	}
// }

// function initSpiral(id,side,preview, bypass) {
// 	if(preview) {
// 		if(!previewInit || bypass) {
// 			let rotate = side == 1 ? 'spiral-l' : 'spiral-r';
// 			var c = document.getElementById(id);
// 			c.style.animation = rotate + ' 1s infinite linear';
// 			c.style.position = 'absolute'
// 			let box = document.getElementById('ctxBox');
// 			c.width = box.offsetWidth*1.2;
// 			c.height = box.offsetWidth*1.2;
// 			c.style.width = box.offsetWidth*1.2 + 'px';
// 			c.style.height = box.offsetWidth*1.2 + 'px';
// 			var centerX = c.offsetWidth/2;
// 			var centerY = c.offsetWidth/2;
// 			var cxt = c.getContext("2d");
// 			cxt.clearRect(0,0,document.querySelector('#' + id).outerWidth(),document.querySelector('#' + id).outerHeight());
// 			let rgb = 255*(1-infOpacity);
// 			cxt.fillStyle = currentColor;
// 			cxt.strokeStyle = hex2hsl(currentColor,infOpacity);
// 			cxt.fillRect(0,0,box.offsetWidth*1.2,box.offsetWidth*1.2);
// 			cxt.moveTo(centerX, centerY);

// 			var STEPS_PER_ROTATION = 60;
// 			var increment = Math.PI / STEPS_PER_ROTATION;
// 			var theta = increment;

// 			while (theta < 40 * Math.PI) {
// 				var newX = centerX + theta * Math.cos(theta);
// 				var newY = centerY + theta * Math.sin(theta);
// 				cxt.lineTo(newX, newY);
// 				theta = theta + increment;
// 			}

// 			cxt.stroke();
// 		}
// 	} else {
// 		let rotate = side == 1 ? 'spiral-l' : 'spiral-r';
// 		var c = document.getElementById(id);
// 		c.style.animation = rotate + ' 0.5s infinite linear';
// 		var centerX = c.offsetWidth/2;
// 		var centerY = c.offsetWidth/2;
// 		var cxt = c.getContext("2d");
// 		cxt.clearRect(0,0,document.querySelector('#' + id).outerWidth(),document.querySelector('#' + id).outerHeight());
// 		cxt.lineWidth = 10;
// 		let rgb = 255*(1-infOpacity);
// 		cxt.fillStyle = currentColor;
// 		cxt.strokeStyle = hex2hsl(currentColor,infOpacity);
// 		//cxt.fillRect(0,0,mainBox.offsetWidth*2,mainBox.offsetWidth*2);
// 		cxt.moveTo(centerX, centerY);

// 		var STEPS_PER_ROTATION = 60;
// 		var increment = Math.PI / STEPS_PER_ROTATION;
// 		var theta = increment;

// 		while (theta < 150 * Math.PI) {
// 			var newX = centerX + theta*6 * Math.cos(theta);
// 			var newY = centerY + theta*6 * Math.sin(theta);
// 			cxt.lineTo(newX, newY);
// 			theta = theta + increment;
// 		}

// 		cxt.stroke();
// 		//document.querySelector("#currentBlock").css("background-color",currentColor);
// 	}
// }

