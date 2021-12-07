let currentTimer;
let numsArray = [];
let infOpacity = 0.6;
let alternateNum = [true,false];
let ladder = {
	up: [6,7,8,9,10,11,12,13,14,13,12,11,10,9,8,7],
	down: [14,13,12,11,10,9,8,7,6,7,8,9,10,11,12,13]
}

function randomPos() {
	for(let i in options['pos']) {
		options['pos'][i][1] = true;
		$('#pos-' + options['pos'][i][0]).removeClass('is-light').addClass('is-info').html('✔');
	}
}

function switchPos(pos) {
	for(let i in options['pos']) {
		if(options['pos'][i][0] == pos) {
			if(options['pos'][i][1] == true) {
				options['pos'][i][1] = false;
				$('#pos-' + pos).removeClass('is-info').addClass('is-light').html('');
			} else {
				options['pos'][i][1] = true;
				$('#pos-' + pos).removeClass('is-light').addClass('is-info').html('✔');
			}
		}
	}
}

function reset() {
	options = {
		'pos': [
			['top-left',false],
			['top-center',false],
			['top-right',false],

			['center-left',false],
			['center-center',false],
			['center-right',false],

			['bottom-left',false],
			['bottom-center',false],
			['bottom-right',false]
		]
	};
	for(let i in options['pos']) {
		$('#pos-' + options['pos'][i][0]).removeClass('is-info').html('').addClass('is-light');
	}
	$('#currentBlock').html(content.settings);
	$('#box').css('background-color','#1d72aa');
}
function opacity(val) {
	$('.anim-inf').css('opacity',val);
	$('#opacitySpan').html(val);
	infOpacity = val;
	initPreviewSpiral(true)
}
function generateNum(sym,arg,index) {
	let arrSum = 0;
	let techMax = sym;
	let techMin = 1;
	if(arg == 1) {
		for(let i in numsArray[index]) {
			arrSum += numsArray[index][i];
		}
	} else {
		for(let i in numsArray) {
			arrSum += numsArray[i];
		}
	}
	if(arrSum == 0) {
		return random(techMin,techMax);
	} else {
		function getNum(mn,mx) {
			let n = random(mn,mx);
			let index = random(1,2) == 1 ? '-' : '+';
			let num = parseInt(index + '' + n);
			if(arrSum + num > techMax || arrSum + num < techMin) {
				return false
			} else {
				return num;
			}
		}
		let num = getNum(techMin,techMax);
		while(num == false) {
			num = getNum(techMin,techMax);
		}
		return num;
	}
}
function generate(opts) {
	numsArray = [];
	let counter = 0;
	let index = 0;
	let engines = opts['engines'];
	if(engines == 2) {
		numsArray = [[],[]];
		for(let k = 0; k < 2; k++) {
			for(let i = 0; i < options['num_count']; i++) {
				numsArray[k].push(generateNum(options['nums'],1,k));
			}
		}
	} else {
		for(let i = 0; i < options['num_count']; i++) {
			numsArray.push(generateNum(options['nums']));
		}
	}
	$('#currentBlock').html(content.preview);
	$('#box').css('background-color',options['bgcolor']);
	initResize();
	adjustColour(document.getElementById('readySpan'));
	let positioned;
	let posArray = [];
	for(let i in options['pos']) {
		if(options['pos'][i][1] == true) {
			positioned = true;
			posArray.push(options['pos'][i][0]);
		}
	}
	function loop (arg) {
		let timeout = arg == 1 ? 100 : options['cooldown']*1000;
		currentTimer = setTimeout(function () {
			if(counter == 0) {
				if(engines == 2) {
					$('#readySpan').html('' +
						'<div class="columns">' +
							'<div class="column">' +
								'<p id="gen1" class="has-text-centered"></p>' +
							'</div>' +
							'<div class="column">' +
								'<p id="gen2" class="has-text-centered"></p>' +
							'</div>' +
						'</div>');
					$('#readySpan').removeClass('is-size-1').css('width','100%');
					adjustColour(document.getElementById('gen1'));
					adjustColour(document.getElementById('gen2'));
					let size;
					if(options['size'] == 'random') {
						size = random(6,14);
					} else if (options['size'] == 'alternation') {
						if(alternateNum[0] == true) {
							size = 14;
							alternateNum[0] = false;
							alternateNum[1] = true;
						} else {
							size = 6;
							alternateNum[0] = true;
							alternateNum[1] = false;
						}
					} else if (options['size'] == 'up'){
						if(index >= 15) {
							index = 0;
						}
						size = ladder.up[index];
					} else if (options['size'] == 'down') {
						if(index >= 15) {
							index = 0;
						}
						size = ladder.down[index];
					} else {
						size = options['size'];
					}
					$('#gen1').html([numsArray[0][0]]).css('font-size',size + 'rem');
					$('#gen2').html([numsArray[1][0]]).css('font-size',size + 'rem');
					$('#readySpan').fadeIn('fast',() => {
						counter++;
						index++;
						loop();
					});
				} else {
					adjustColour(document.getElementById('readySpan'));
					if(positioned) {
						//$('#btnBox').removeClass();
						//$('#btnBox').addClass(posArray[random(0,posArray.length-1)] + ' is-flex-direction-column');
						let pos = posArray[random(0,posArray.length-1)];
						let posTop = options['size'] < 8 ? '6rem' : '0';
						switch(pos) {
							case 'top-left' :
								$('#readySpan').css('position','absolute');
								$('#readySpan').css('top', posTop);
								$('#readySpan').css('left','2rem');
							break;
							case 'top-center' :
								$('#readySpan').css('position','absolute');
								$('#readySpan').css('top',posTop);
								$('#readySpan').css('text-align','center');
							break;
							case 'top-right' :
								$('#readySpan').css('position','absolute');
								$('#readySpan').css('top',posTop);
								$('#readySpan').css('right','2rem');
							break;

							case 'center-left' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('left','2rem');
								break;
								case 'center-center' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('text-align','center');
								break;
								case 'center-right' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('right','2rem');
								break;
							case 'bottom-left' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('left','2rem');
								break;
								case 'bottom-center' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('text-align','center');
								break;
								case 'bottom-right' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('right','2rem');
								break;
						}
					}
					$('#readySpan').html(numsArray[0]);
					$('#readySpan').removeClass('is-size-1');
					let size;
					if(options['size'] == 'random') {
						size = random(6,14);
					} else if (options['size'] == 'alternation') {
						if(alternateNum[0] == true) {
							size = 14;
							alternateNum[0] = false;
							alternateNum[1] = true;
						} else {
							size = 6;
							alternateNum[0] = true;
							alternateNum[1] = false;
						}
					} else if (options['size'] == 'up'){
						if(index >= 15) {
							index = 0;
						}
						size = ladder.up[index];
					} else if (options['size'] == 'down') {
						if(index >= 15) {
							index = 0;
						}
						size = ladder.down[index];
					} else {
						size = options['size'];
					}
					$('#readySpan').css('font-size',size + 'rem');
					$('#readySpan').css('margin-top','-2%');
					$('#readySpan').fadeIn('fast',() => {
						counter++;
						index++;
						loop();
					});
				}
				initResize();
			} else {
				$('#readySpan').fadeOut('fast',()=>{
					if(engines == 2) {
						let str1 = '';
						if(numsArray[0][counter] > 0) {
							str1 = '+' + numsArray[0][counter];
						} else {
							str1 = numsArray[0][counter];
						}
						let str2 = '';
						if(numsArray[1][counter] > 0) {
							str2 = '+' + numsArray[1][counter];
						} else {
							str2 = numsArray[1][counter];
						}
						$('#gen1').html(str1);
						$('#gen2').html(str2);
						let size;
						if(options['size'] == 'random') {
							size = random(6,14);
						} else if (options['size'] == 'alternation') {
							if(alternateNum[0] == true) {
								size = 14;
								alternateNum[0] = false;
								alternateNum[1] = true;
							} else {
								size = 6;
								alternateNum[0] = true;
								alternateNum[1] = false;
							}
						} else if (options['size'] == 'up'){
							if(index >= 15) {
								index = 0;
							}
							size = ladder.up[index];
						} else if (options['size'] == 'down') {
							if(index >= 15) {
								index = 0;
							}
							size = ladder.down[index];
						} else {
							size = options['size'];
						}
						$('#readySpan').css('font-size',size + 'rem');
						$('#readySpan').fadeIn('fast');
						if (counter < options['num_count']) {
							counter++;
							index++;
							loop();
						} else if (counter == options['num_count']) {
							finish(numsArray,true);
						}
					} else {
						adjustColour(document.getElementById('readySpan'));
						let str = '';
						if(numsArray[counter] > 0) {
							str = '+' + numsArray[counter];
						} else {
							str = numsArray[counter];
						}
						if(positioned) {
							let pos = posArray[random(0,posArray.length-1)];
							/*
			'top-left','is-flex is-justify-content-start',false],
			['top-center','is-flex is-justify-content-center',false],
			['top-right','is-flex is-justify-content-end',false],

			['center-left','is-flex is-align-items-center',false],
			['center-center','is-flex is-align-items-center is-justify-content-center',false],
			['center-right','is-flex is-align-items-center is-justify-content-end',false],

			['bottom-left','is-flex is-align-items-flex-end',false],
			['bottom-center','is-flex is-align-items-flex-end is-justify-content-center',false],
			['bottom-right'

							*/
							$('#readySpan').removeAttr('style');
							$('#readySpan').css('display','none');
							let size;
							if(options['size'] == 'random') {
								size = random(6,14);
							} else if (options['size'] == 'alternation') {
								if(alternateNum[0] == true) {
									size = 14;
									alternateNum[0] = false;
									alternateNum[1] = true;
								} else {
									size = 6;
									alternateNum[0] = true;
									alternateNum[1] = false;
								}
							} else if (options['size'] == 'up'){
								if(index >= 15) {
									index = 0;
								}
								size = ladder.up[index];
							} else if (options['size'] == 'down') {
								if(index >= 15) {
									index = 0;
								}
								size = ladder.down[index];
							} else {
								size = options['size'];
							}
							$('#readySpan').css('font-size',size + 'rem');
							$('#readySpan').css('margin-top','-2%');
							switch(pos) {
								case 'top-left' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('top','-2rem');
									$('#readySpan').css('left','2rem');
								break;
								case 'top-center' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('top','-2rem');
									$('#readySpan').css('text-align','center');
								break;
								case 'top-right' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('top','-2rem');
									$('#readySpan').css('right','2rem');
								break;

								case 'center-left' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('left','2rem');
								break;
								case 'center-center' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('text-align','center');
								break;
								case 'center-right' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('margin-top','auto');
									$('#readySpan').css('right','2rem');
								break;

								case 'bottom-left' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('left','2rem');
								break;
								case 'bottom-center' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('text-align','center');
								break;
								case 'bottom-right' :
									$('#readySpan').css('position','absolute');
									$('#readySpan').css('bottom','0');
									$('#readySpan').css('right','2rem');
								break;
							}
						}
						adjustColour(document.getElementById('readySpan'));
						$('#readySpan').html(str);
						let size;
						if(options['size'] == 'random') {
							size = random(6,14);
						} else if (options['size'] == 'alternation') {
							if(alternateNum[0] == true) {
								size = 14;
								alternateNum[0] = false;
								alternateNum[1] = true;
							} else {
								size = 6;
								alternateNum[0] = true;
								alternateNum[1] = false;
							}
						} else if (options['size'] == 'up'){
							if(index >= 15) {
								index = 0;
							}
							size = ladder.up[index];
						} else if (options['size'] == 'down') {
							if(index >= 15) {
								index = 0;
							}
							size = ladder.down[index];
						} else {
							size = options['size'];
						}
						$('#readySpan').css('font-size',size + 'rem');
						$('#readySpan').fadeIn('fast');
						if (counter < options['num_count']) {
							counter++;
							index++;
							loop();
						} else if (counter == options['num_count']) {
							$('#readySpan').removeAttr('style');
							finish(numsArray);
						}
					}
				});
				initResize();
			}
		}, timeout);
	}
	setTimeout(()=>{
		$('#readySpan').fadeOut('fast',()=>{
			loop(1);
		});
	},3000)
}

function finish(arr,two) {
	currentTimer = null;
	spiralSide = null;
	let sum = 0;
	let span = '';
	if(two) {
		//<p id="numspan" class="has-text-weight-semibold is-size-2 has-text-light" hidden>Сумма: <b id="num_sum"></b></p>
		let sum1 = 0;
		for(let i in arr[0]) {
			sum1 += arr[0][i];
		}
		let sum2 = 0;
		for(let i in arr[1]) {
			sum2 += arr[1][i];
		}
		span = '<div id="numspan" style="display:none"><p class="has-text-weight-semibold is-size-2 has-text-light">Сумма 1: <b>' + sum1 + '</b></p><p class="has-text-weight-semibold is-size-2 has-text-light">Сумма 2: <b>' + sum2 + '</b></p></div>';
	} else {
		for(let i in arr) {
			sum += arr[i];
		}
		span = '<p id="numspan" style="display:none" class="has-text-weight-semibold is-size-2 has-text-light">Сумма: <b>' + sum + '</b></p>'
	}
	$('#box').css('background-color','#1d72aa');
	$('#readySpan').html('' +
		'<div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column" id="btnBox">' +
		span +
			'<div class="has-background-light p-4" id="btngroup" style="border-radius:0.2rem;box-shadow: 0.3rem 0.3rem 1.3rem #175b87;">' +
				'<button class="is-fullwidth button is-info" onclick="$(' + "'" + '#numspan' + "'" + ').fadeIn()">Сумма</button>' + 
				'<button class="is-fullwidth button is-info mt-4" onclick="generate(options)">Ещё раз</button>' +
				'<button class="is-fullwidth button is-info mt-4" onclick="reset();initResize()">Выход</button>' +
			'</div>' +
		'</div>'
	);
	initResize();
}

function restart() {
	generate(options);
}

let options = {
		'pos': [
			['top-left',false],
			['top-center',false],
			['top-right',false],

			['center-left',false],
			['center-center',false],
			['center-right',false],

			['bottom-left',false],
			['bottom-center',false],
			['bottom-right',false]
		]
	};
function start() {
	fetch(('/question'), {
		method: 'POST'
	}).then(response => {
		if(response){
			options['num_count'] = Math.abs(document.getElementById('num_count').value);
			options['cooldown'] = Math.abs(document.getElementById('cooldown').value);
			options['nums'] = parseInt(document.getElementById('nums').value);
			options['bgcolor'] = document.getElementById('bgcolor').value;
			options['size'] = document.getElementById('size').value;
			options['engines'] = document.getElementById('engines').value;
			if(spiralSide == 0 || spiralSide == 1) {
				animated('spiral',spiralSide);
			}
			generate(options);
			initResize();
		} else {
			return error;
		}
	});
}
function random(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

function triggerPreset(val) {
	$('.smallBox').prop('disabled',true);
	$('.spiral-left').prop('disabled',true);
	$('.spiral-right').prop('disabled',true);
	$('.posBtn').prop('disabled',true);
	$('.randomBtn').prop('disabled',true);
	switch(parseInt(val)) {
		case 0: //выкл
			$('.smallBox').prop('disabled',false);
			$('.spiral-left').prop('disabled',false);
			$('.spiral-right').prop('disabled',false);
			$('.posBtn').prop('disabled',false);
			$('.randomBtn').prop('disabled',false);
		break;
		case 1: //Астигматизм без осложнений
			$('#pos-center-center').prop('disabled',false);
			$('.sun-increase').prop('disabled',false);
			$('.sun-decrease').prop('disabled',false);

			$('.circle-increase').prop('disabled',false);
			$('.circle-decrease').prop('disabled',false);

			$('.romb-increase').prop('disabled',false);
			$('.romb-decrease').prop('disabled',false);

			$('.rectangle-increase').prop('disabled',false);
			$('.rectangle-decrease').prop('disabled',false);
		break;
		case 2: //Астигматизм и миопия
			$('#pos-center-center').prop('disabled',false);
			$('.sun-decrease').prop('disabled',false);

			$('.circle-decrease').prop('disabled',false);

			$('.romb-decrease').prop('disabled',false);

			$('.rectangle-decrease').prop('disabled',false);
		break;
		case 3: //Астигматизм и гиперметропия
			$('#pos-center-center').prop('disabled',false);
			$('.sun-increase').prop('disabled',false);

			$('.circle-increase').prop('disabled',false);


			$('.romb-increase').prop('disabled',false);

			$('.rectangle-increase').prop('disabled',false);
		break;


		case 4: //Амблиопия
			$('.smallBox').prop('disabled',false);
			$('.spiral-left').prop('disabled',false);
			$('.spiral-right').prop('disabled',false);
			$('.posBtn').prop('disabled',false);
			$('.randomBtn').prop('disabled',false);
		break;
		case 5: //Близорукость (миопия)
			$('#pos-center-center').prop('disabled',false);
			$('#pos-top-right').prop('disabled',false);
			$('#pos-top-left').prop('disabled',false);
			$('#pos-bottom-right').prop('disabled',false);
			$('#pos-bottom-left').prop('disabled',false);

			$('.sun-increase').prop('disabled',false);
			$('.circle-increase').prop('disabled',false);
			$('.romb-increase').prop('disabled',false);
			$('.rectangle-increase').prop('disabled',false);
			$('.cyl-increase').prop('disabled',false);
			$('.spiral-left').prop('disabled',false);
			$('.square-increase').prop('disabled',false);
			$('.mill-decrease').prop('disabled',false);

		break;
		case 6: //Дальнозоркость (гиперметропия)
			$('#pos-center-center').prop('disabled',false);
			$('#pos-top-center').prop('disabled',false);
			$('#pos-center-left').prop('disabled',false);
			$('#pos-center-right').prop('disabled',false);
			$('#pos-bottom-center').prop('disabled',false);

			$('.sun-decrease').prop('disabled',false);
			$('.circle-decrease').prop('disabled',false);
			$('.romb-decrease').prop('disabled',false);
			$('.rectangle-decrease').prop('disabled',false);
			$('.cyl-decrease').prop('disabled',false);
			$('.spiral-right').prop('disabled',false);
			$('.square-decrease').prop('disabled',false);
			$('.mill-increase').prop('disabled',false);

		break;
		case 7: //Глаукома + миопия
			$('#pos-center-center').prop('disabled',false);
			$('#pos-top-right').prop('disabled',false);
			$('#pos-top-left').prop('disabled',false);
			$('#pos-bottom-right').prop('disabled',false);
			$('#pos-bottom-left').prop('disabled',false);

			$('.sun-increase').prop('disabled',false);
			$('.circle-increase').prop('disabled',false);
			$('.romb-increase').prop('disabled',false);
			$('.rectangle-increase').prop('disabled',false);
			$('.cyl-increase').prop('disabled',false);
			$('.spiral-left').prop('disabled',false);
			$('.square-increase').prop('disabled',false);
			$('.mill-decrease').prop('disabled',false);
		break;
		case 8: //Глаукома + гиперметропия
			$('#pos-center-center').prop('disabled',false);
			$('#pos-top-center').prop('disabled',false);
			$('#pos-center-left').prop('disabled',false);
			$('#pos-center-right').prop('disabled',false);
			$('#pos-bottom-center').prop('disabled',false);

			$('.sun-decrease').prop('disabled',false);
			$('.circle-decrease').prop('disabled',false);
			$('.romb-decrease').prop('disabled',false);
			$('.rectangle-decrease').prop('disabled',false);
			$('.cyl-decrease').prop('disabled',false);
			$('.spiral-right').prop('disabled',false);
			$('.square-decrease').prop('disabled',false);
			$('.mill-increase').prop('disabled',false);
		break;
	}
}
let content = {
	settings: '' +
		'<div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column" id="btnBox">' +
			'<div class="p-3" style="backdrop-filter: brightness(60%);border-radius:0.5rem">' +
				'<p class="has-text-white is-size-3 has-text-centered" style="z-index:10"><b>Тренировочный режим</b></p>' +
				'<p class="has-text-light is-size-5 has-text-centered" style="z-index:10">Выберите пресет настроек</p>' +
				'<div class="is-flex is-justify-content-center mt-2">' +
					'<div class="select">' +
						'<select id="preset" onchange="triggerPreset(this.value)">' +
							'<option value="0" selected>Нет</option>' +
							'<option value="1">Астигматизм без осложнений</option>' +
							'<option value="2">Астигматизм и миопия</option>' +
							'<option value="3">Астигматизм и гиперметропия</option>' +
							'<option value="4">Амблиопия</option>' +
							'<option value="5">Близорукость (миопия)</option>' +
							'<option value="6">Дальнозоркость (гиперметропия)</option>' +
							'<option value="7">Глаукома + миопия</option>' +
							'<option value="8">Глаукома + гиперметропия</option>' +
						'</select>' +
					'</div>' +
					'<button class="ml-2 button is-info" onclick="$(' + "'" + '#infoModal' + "'" + ').addClass(' + "'" + 'is-active' + "'" + ')">Инфо о пресетах</button>' +
				'</div>' +
			'</div>' +
		'<div class="is-flex-direction-row p-3 is-flex mt-3" style="z-index:10;border-radius:0.5rem;backdrop-filter: brightness(60%);">' +
			'<div class="is-flex is-flex-direction-column p-2">' +
				'<p class="mb-0 has-text-centered is-size-7 has-text-light">Кол-во чисел</p>' +
				'<input class="input" type="number" id="num_count" placeholder="Кол-во чисел" value="10">' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Счёт до</p>' +
				'<div class="select is-fullwidth">' +
					'<select id="nums">' +
						'<option value="10" selected>10</option>' +
						'<option value="20">20</option>' +
						'<option value="30">30</option>' +
						'<option value="40">40</option>' +
						'<option value="50">50</option>' +
						'<option value="100">100</option>' +
						'<option value="250">250</option>' +
						'<option value="500">500</option>' +
						'<option value="1000">1000</option>' +
					'</select>' +
				'</div>' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Кол-во цифр на экране</p>' +
				'<div class="select is-fullwidth">' +
					'<select id="engines" onchange="triggerEngines(this.options[this.selectedIndex].value)">' +
						'<option value="1" selected>1</option>' +
						'<option value="2">2</option>' +
					'</select>' +
				'</div>' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Размер шрифта</p>' +
				'<div class="select is-fullwidth">' +
					'<select id="size">' +
						'<option value="6">6</option>' +
						'<option value="7">7</option>' +
						'<option value="8">8</option>' +
						'<option value="9">9</option>' +
						'<option value="10" selected>10</option>' +
						'<option value="11">11</option>' +
						'<option value="12">12</option>' +
						'<option value="13">13</option>' +
						'<option value="14">14</option>' +
						'<option value="random">Случайный размер</option>' +
						'<option value="alternation">Чередование</option>' +
						'<option value="up">Возрастание</option>' +
						'<option value="down">Убывание</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
			'<div class="is-flex is-flex-direction-column p-2" style="z-index:10">' +
				'<p class="mb-0 has-text-centered is-size-7 has-text-light">Задержка (с)</p>' +
				'<input class="input" type="number" id="cooldown" placeholder="Задержка" step="0.1" value="1">' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Помехи</p>' +
				'<button class="button is-light is-fullwidth" onclick="$(' + "'" + '#infModal' + "'" + ').addClass(' + "'" + 'is-active' + "'" + ');initPreviewSpiral(true)" id="infBtn">Выбрать</button>' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Цвет фона</p>' +
				'<input type="color" id="bgcolor" onchange="colorizeBoxes(this.value);" class="is-fullwidth" value="#ffffff">' +
				'<p class="mb-0 mt-2 has-text-centered is-size-7 has-text-light">Позиция чисел</p>' +
				'<button class="button is-light is-fullwidth" onclick="$(' + "'" + '#posModal' + "'" + ').addClass(' + "'" + 'is-active' + "'" + ')" id="posBtn">Выбрать</button>' +
			'</div>' +
		'</div>' +
		'<button onclick="start()" class="button is-medium is-info mt-3" style="padding-left:5rem;padding-right:5rem">Начать</button>',
	preview: '' +
		'<div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column" id="btnBox" style="position:relative">' +
		'<h1 class="is-size-1 has-text-weight-bold" id="readySpan">Приготовились</h1>' +
		'</div>'
}
function colorizeBoxes(val) {
	currentColor = val;
	$('.smallBox').css('background-color',val);
	$('#box').css('background-color',val);
	if(spiralSide == 0 || spiralSide == 1) {
		animated('spiral', spiralSide);
	}
}
function triggerFullscreen(arg) {
	if(arg == 'to') {
		let element = document.getElementById('box');
		if(element.requestFullScreen) { element.requestFullScreen() } 
		else if(element.mozRequestFullScreen) { element.mozRequestFullScreen() }
		else if(element.webkitRequestFullScreen) { element.webkitRequestFullScreen() }
		document.getElementById('currentBlock').style.height = '100vh';
		document.getElementById('fs_trigger').onclick = () => { triggerFullscreen('out') }
		document.querySelector('#fs_icon').src = '/fs_out.svg';
	} else {
		if(document.cancelFullScreen) { document.cancelFullScreen() } 
		else if(document.mozCancelFullScreen) { document.mozCancelFullScreen() } 
		else if(document.webkitCancelFullScreen) { document.webkitCancelFullScreen() }
		document.getElementById('currentBlock').style.height = '';
		document.getElementById('currentBlock').style.minHeight = '70vh';
		document.getElementById('fs_trigger').onclick = () => { triggerFullscreen('to') }
		document.querySelector('#fs_icon').src = '/fs_in.svg';
	}
}
function triggerEngines(val) {
	if(val == 2) {
		$('#posBtn').attr('disabled','disabled');
	} else {
		$('#posBtn').prop('disabled',false);
	}
}
var onfullscreenchange =  function(e){
	var fullscreenElement = 
		document.fullscreenElement || 
		document.mozFullscreenElement || 
		document.webkitFullscreenElement;
	if(fullscreenElement) {
		document.getElementById('fs_trigger').onclick = () => { triggerFullscreen('out') }
		document.getElementById('fs_icon').src = '/fs_out.svg';
		document.getElementById('currentBlock').style.height = '100vh';
	} else {
		document.getElementById('fs_trigger').onclick = () => { triggerFullscreen('to') }
		document.getElementById('fs_icon').src = '/fs_in.svg';
		document.getElementById('currentBlock').style.height = '';
		document.getElementById('currentBlock').style.minHeight = '70vh';
	}
	initResize();
}
document.getElementById('box').addEventListener("webkitfullscreenchange", onfullscreenchange);

function rgbstringToTriplet(rgbstring) {
	var commadelim = rgbstring.substring(4,rgbstring.length-1);
	var strings = commadelim.split(",");
	var numeric = [];
	for(var i=0; i<3; i++) { numeric[i] = parseInt(strings[i]); }
	return numeric;
}

function adjustColour(someelement) {
	let bg = document.getElementById('box');
	var rgbstring = bg.style.backgroundColor;
	var triplet = rgbstringToTriplet(rgbstring);
	var newtriplet = [];
	var total = 0; for (var i=0; i<triplet.length; i++) { total += triplet[i]; } 
	if(total > (3*256/2)) {
		newtriplet = [0,0,0];
		$(someelement).css('-webkit-text-stroke','2px rgb(255,255,255)');
	} else {
		newtriplet = [255,255,255];
		$(someelement).css('-webkit-text-stroke','2px rgb(0,0,0)');
	}
	var newstring = "rgb("+newtriplet.join(",")+")";
	someelement.style.color = newstring;
	return true;
}

$('#currentBlock').html(content.settings);

const question = () => {
	
}