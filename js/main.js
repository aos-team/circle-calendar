		
var mouseX,mouseY,i,j;
var screenWidth,screenHeight;
var bgRatio = 1920/1080;

var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'moz' :
		'opera' in window ? 'o' :
		navigator.userAgent.indexOf("Trident")>-1 ? 'ms' : '';

// Seasons Variables
var seasons = ['winter','spring','summer','fall'];
var colors = [
	{	//Winter
		background : '#fff',
		seasonInactive : '#a2a2a2',
		seasonActive : '#545454',
		monthActive : '#373737',
		project : '#bcbcbc',
		caseStudy : '#b5b5b5',
		stream: '#adadad',
		eventOver : '#000000',
		eventOverCircle : '#ffffff',
		sec : '#d8d8d8',
		min : '#d2d2d2',
		hours : '#c3c3c3',
		restOfDays : '#a1a1a1',
		copy : '#111111',
		copyBG : '#575757'
	},
	{	//Spring
		background : '#fff',
		seasonInactive : '#81bfbe',
		seasonActive : '#41999b',
		monthActive : '#32a9ad',
		project : '#add4d3',
		caseStudy : '#a3cdcc',
		stream: '#97c4c7',
		eventOver : '#dbf5ea',
		eventOverCircle : '#7fd5b8',
		sec : '#59919e',
		min : '#5d96a1',
		hours : '#68a1a8',
		restOfDays : '#81bfbc',
		copy : '#7fd5b8',
		copyBG : '#dcf6eb'
	},
	{	//Summer
		background : '#fff',
		seasonInactive : '#90c17f',
		seasonActive : '#529e3e',
		monthActive : '#48b22d',
		project : '#a9cf9c',
		caseStudy : '#a0ca95',
		stream: '#97c48d',
		eventOver : '#e1f3c6',
		eventOverCircle : '#b1d77d',
		sec : '#d0e8b8',
		min : '#c8e2b1',
		hours : '#b6d6a1',
		restOfDays : '#44962e',
		copy : '#c9e2a1',
		copyBG : '#e2f3c7'
	},
	{	//Fall
		background : '#fff',
		seasonInactive : '#b09270',
		seasonActive : '#9e4c37',
		monthActive : '#b43f2b',
		project : '#c9a782',
		caseStudy : '#c2a27b',
		stream: '#ba9d75',
		eventOver : '#932318',
		eventOverCircle : '#641413',
		sec : '#eabb91',
		min : '#e3b289',
		hours : '#d2a57e',
		restOfDays : '#af916f',
		copy : '#631515',
		copyBG : '#922217'
	}
];



var monthStrs = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

var currSeason;
var monthInSeason;

//Catergory Variables
var categories = ['projects','case study','stream'];

//Animation Variables
var tl = new TimelineLite({onUpdate:draw,onComplete:function(){
	updateDate();
	requestAnimationFrame( testInteraction );
}});

var tlout = new TimelineLite({onUpdate:draw,onComplete:function(){
	resetVariables();
	animateIn();
}});

var controls = {
	//Seasons
	seasonsSmall:[],
	seasonsBig:[],

	//Categories
	categories:[],

	//Events
	events:[],

	//Days
	days:[],

	//Sep Lines
	lines:{val:0},
};

//Init seasons animation variables
for(i=0;i<seasons.length;i++){
	controls.seasonsSmall[i] = {val:0,valEnd:0};
	controls.seasonsBig[i] = {val:0,valEnd:0,months:[]};
	for(j=0;j<3;j++){
		controls.seasonsBig[i].months[j] = {val:0,isOver:false};
	}
}

//Init categories animation variables
for(i=0;i<=categories.length;i++){
	controls.categories[i] = {val:0};
}
		
//Create main container
var container = document.createElement('div');
container.style.position = 'absolute';
document.body.appendChild(container);
		
//Init canvas
var canvas = document.createElement("canvas");
canvas.width = $(window).width();
canvas.height = $(window).height();
container.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.rotate(-Math.PI/6);

//Init Date
var today = new Date();
var currSec = (today.getSeconds()+1)/60;
var currMins = (today.getMinutes()+1)/60;
var currHours = (today.getHours()+1)/24;
var currDay = today.getDate();
var currMonth = today.getMonth();
var todayMonth = currMonth;
var currYear = today.getFullYear();
var numDays = daysInMonth(currMonth,currYear);
var restDays = numDays-currDay;

var todayNumDays = numDays;
var todayCurrDay = currDay;

//Init day nums
var numDaysArray = [];

var numContainer = document.createElement('div');
numContainer.style.position = 'absolute';
numContainer.style.top = '50%';
numContainer.style.left = '50%';
container.appendChild(numContainer);

for(i=0;i<=numDays;i++){
	controls.days[i] = {val:-220};

	if(i<numDays){
		var divContainer = document.createElement('div');
		divContainer.style.position = 'absolute';
		divContainer.style.top = '0px';
		divContainer.style.left = '0px';
		divContainer.style.width = '0px';
		divContainer.style.height = '0px';
		$(divContainer).css('-'+vendor+'-transform','rotate('+(i*360/numDays+1-(180/3))+'deg)');

		var div = document.createElement('div');
		div.style.marginTop = '0px';
		div.style.color = '#ffffff';
		div.style.fontFamily = 'tstar,Arial,sans-serif';
		div.style.fontSize = '12px';
		div.style.opacity = '0';

		if((i+1)<10){
			div.innerHTML = '0'+(i+1);
		}
		else{
			div.innerHTML = ''+(i+1);
		}

		divContainer.appendChild(div);
		numContainer.appendChild(divContainer);

		numDaysArray.push(div);
	}
}

//Init rest of day
var restOfDay = {val:0};
var currDayObj = {val:(Math.PI*2/numDays)};
var secObj = {val:(Math.PI*2/numDays)};
var minObj = {val:(Math.PI*2/numDays)};
var hourObj = {val:(Math.PI*2/numDays)};

if(currMonth>=11 || currMonth<2){ //Winter
	currSeason = 0;
	if(currMonth == 11){
		monthInSeason = 0;
	}
	else{
		monthInSeason = currMonth+1;
	}
}
else if(currMonth>=2 && currMonth<5){ //Spring
	currSeason = 1;
	monthInSeason = currMonth-2;
}
else if(currMonth>=5 && currMonth<8){ //Summer
	currSeason = 2;
	monthInSeason = currMonth-5;
}
else{ //Fall
	currSeason = 3;
	monthInSeason = currMonth-8;
}

$('.copy').css('color',colors[currSeason].copy);
$('.copy-container').css('background-color',colors[currSeason].copyBG);

$('.month-tooltip-copy').css('color',colors[currSeason].copy);
$('.month-tooltip-container').css('background-color',colors[currSeason].copyBG);

$('#bg').css('background-color',colors[currSeason].background);

var todaySeason = currSeason;
var todayMonthInSeason = monthInSeason;

//Load xml
$.ajax({
	type: "GET",
	url: "xml/calendar.xml",
	dataType: "xml",
	success: parseXml
});

var events = [];
var data;
var prevOver = false;

function resetVariables(){
	shouldInteract = true;

	tl = new TimelineLite({onUpdate:draw,onComplete:function(){
		updateDate();
		requestAnimationFrame( testInteraction );
	}});

	tlout = new TimelineLite({onUpdate:draw,onComplete:function(){
		resetVariables();
		animateIn();
	}});

	controls = {
		//Seasons
		seasonsSmall:[],
		seasonsBig:[],

		//Categories
		categories:[],

		//Events
		events:[],

		//Days
		days:[],

		//Sep Lines
		lines:{val:0},
	};

	//Init seasons animation variables
	for(i=0;i<seasons.length;i++){
		controls.seasonsSmall[i] = {val:0,valEnd:0};
		controls.seasonsBig[i] = {val:0,valEnd:0,months:[]};
		for(j=0;j<3;j++){
			controls.seasonsBig[i].months[j] = {val:0,isOver:false};
		}
	}

	//Init categories animation variables
	for(i=0;i<=categories.length;i++){
		controls.categories[i] = {val:0};
	}

	//Init Date
	today = new Date(); // new Date(currYear,overMonth,daysInMonth(overMonth,currYear));
	currSec = (today.getSeconds()+1)/60;
	currMins = (today.getMinutes()+1)/60;
	currHours = (today.getHours()+1)/24;

	currDay = today.getDate();
	currMonth = today.getMonth();
	currYear = today.getFullYear();
	numDays = daysInMonth(currMonth,currYear);
	restDays = numDays-currDay;

	//Init day nums
	numDaysArray = [];

	numContainer.innerHTML = '';

	for(i=0;i<=numDays;i++){
		controls.days[i] = {val:-220};

		if(i<numDays){
			var divContainer = document.createElement('div');
			divContainer.style.position = 'absolute';
			divContainer.style.top = '0px';
			divContainer.style.left = '0px';
			divContainer.style.width = '0px';
			divContainer.style.height = '0px';
			$(divContainer).css('-'+vendor+'-transform','rotate('+(i*360/numDays+1-(180/3))+'deg)');

			var div = document.createElement('div');
			div.style.marginTop = '0px';
			div.style.color = '#ffffff';
			div.style.fontFamily = 'tstar,Arial,sans-serif';
			div.style.fontSize = '12px';
			div.style.opacity = '0';

			if((i+1)<10){
				div.innerHTML = '0'+(i+1);
			}
			else{
				div.innerHTML = ''+(i+1);
			}

			divContainer.appendChild(div);
			numContainer.appendChild(divContainer);

			numDaysArray.push(div);
		}
	}

	//Init rest of day
	restOfDay = {val:0};
	currDayObj = {val:(Math.PI*2/numDays)};
	secObj = {val:(Math.PI*2/numDays)};
	minObj = {val:(Math.PI*2/numDays)};
	hourObj = {val:(Math.PI*2/numDays)};

	if(currMonth>=11 || currMonth<2){ //Winter
		currSeason = 0;
		if(currMonth == 11){
			monthInSeason = 0;
		}
		else{
			monthInSeason = currMonth+1;
		}
	}
	else if(currMonth>=2 && currMonth<5){ //Spring
		currSeason = 1;
		monthInSeason = currMonth-2;
	}
	else if(currMonth>=5 && currMonth<8){ //Summer
		currSeason = 2;
		monthInSeason = currMonth-5;
	}
	else{ //Fall
		currSeason = 3;
		monthInSeason = currMonth-8;
	}

	$('.copy').css('color',colors[currSeason].copy);
	$('.copy-container').css('background-color',colors[currSeason].copyBG);

	$('.month-tooltip-copy').css('color',colors[currSeason].copy);
	$('.month-tooltip-container').css('background-color',colors[currSeason].copyBG);

	events = [];
	data.find('event').each(function(i){
		var ev;
		var evDate = new Date(parseFloat($(this).find('date').find('year').text()),parseFloat($(this).find('date').find('month').text())-1,parseFloat($(this).find('date').find('day').text()));

		if(evDate.getMonth() == today.getMonth() && evDate.getFullYear() == today.getFullYear()){
			ev = {
				title : $(this).find('title').text(),
				headline : $(this).find('headline').text(),
				category : $(this).find('category').text(),
				link : $(this).find('link').text(),
				date : evDate,
				isOver:false
			} 
			events.push(ev);
		}
	});

	//Init events animation variables
	for(i=0;i<=events.length;i++){
		controls.events[i] = {val:0,valEnd:0,over:0,overCircle:0};
	}

	TweenLite.to($('#bg'),1,{backgroundColor:colors[currSeason].background});
}

function parseXml(xml){

	data = $(xml);
	data.find('event').each(function(i){
		var ev;
		var evDate = new Date(parseFloat($(this).find('date').find('year').text()),parseFloat($(this).find('date').find('month').text())-1,parseFloat($(this).find('date').find('day').text()));

		if(evDate.getMonth() == today.getMonth() && evDate.getFullYear() == today.getFullYear()){
			ev = {
				title : $(this).find('title').text(),
				headline : $(this).find('headline').text(),
				category : $(this).find('category').text(),
				link : $(this).find('link').text(),
				date : evDate,
				isOver:false
			} 
			events.push(ev);
		}
	});

	//Init events animation variables
	for(i=0;i<=events.length;i++){
		controls.events[i] = {val:0,valEnd:0,over:0,overCircle:0};
	}

	$(window).mousemove(onWindowMouseMove);
	$(window).resize(onWindowResize);
	$(document).click(onDocClick);
	onWindowResize();

	animateIn();
}

function animateIn(){
	
	//Animate categories
	for(j=0;j<=categories.length;j++){
		
		if(j>0){
			tl.to(controls.categories[j],1,{val:Math.PI*2, ease:Expo.easeInOut},"-=0.8");
		}
		else{
			tl.to(controls.categories[j],1,{val:Math.PI*2, ease:Expo.easeInOut},"categories");
		}
		
	}

	//Animate seasons
	for(j=0;j<seasons.length;j++){
		tl.staggerTo(controls.seasonsSmall,1,{val:Math.PI*2, ease:Expo.easeInOut},0.2,"categories");
	}


	for(j=0;j<seasons.length;j++){
		tl.staggerTo(controls.seasonsBig,1,{val:Math.PI*2, ease:Expo.easeInOut},0.2,"categories");
	}

	//Animate Day Lines
	for(j=0;j<numDays;j++){
		tl.staggerTo(controls.days,1,{val:-400, ease:Expo.easeInOut},(0.8/numDays),"categories");
	}

	//Animate Day Nums
	for(j=0;j<numDaysArray.length;j++){
		tl.staggerTo(numDaysArray,1,{css:{marginTop:-235,opacity:0.3}, ease:Expo.easeInOut},(0.8/numDaysArray.length),"categories");
	}

	//Animate Sep Lines
	tl.to(controls.lines,1,{val:1, ease:Expo.easeInOut},"categories");
	

	//Animate Events
	for(j=0;j<events.length;j++){
		tl.to(controls.events[j],1,{val:1, ease:Expo.easeInOut,delay:j*0.5},"categories");
	}

	//Animating rest of day
	tl.to(restOfDay,1.5,{val:(-((restDays+1)*(Math.PI*2/numDays))),ease:Expo.easeInOut,delay:((0.8/numDaysArray.length)+1-0.4)},"categories");
	tl.to(currDayObj,1.5,{val:0,ease:Expo.easeInOut,delay:((0.8/numDaysArray.length)+1-0.4)},"categories");
	tl.to(secObj,1.5,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*currSec,ease:Expo.easeInOut,delay:((0.8/numDaysArray.length)+1)},"categories");
	tl.to(minObj,1.5,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*currMins,ease:Expo.easeInOut,delay:((0.8/numDaysArray.length)+1)},"categories");
	tl.to(hourObj,1.5,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*currHours,ease:Expo.easeInOut,delay:((0.8/numDaysArray.length)+1)},"categories");


	tl.play();

	//Animate Background
	TweenLite.to($('#bg'),2,{css:{opacity:1}});

}

function animateOut(){
	TweenLite.to($('.month-tooltip-container'),0.5,{css:{width:'0px'},ease:Expo.easeOut});

	//Animating rest of day
	tlout.to(restOfDay,1,{val:0,ease:Expo.easeInOut},"start");
	tlout.to(currDayObj,1,{val:(Math.PI*2/numDays),ease:Expo.easeInOut},"start");
	tlout.to(secObj,1,{val:(Math.PI*2/numDays),ease:Expo.easeInOut},"start");
	tlout.to(minObj,1,{val:(Math.PI*2/numDays),ease:Expo.easeInOut},"start");
	tlout.to(hourObj,1,{val:(Math.PI*2/numDays),ease:Expo.easeInOut},"start");

	tl.to(controls.lines,1,{val:0, ease:Expo.easeInOut},"start");

	for(j=events.length-1;j>=0;j--){
		tlout.to(controls.events[j],0.5,{valEnd:1, ease:Expo.easeInOut,delay:(events.length-1-j)*0.2},"start");
	}

	for(j=0;j<numDaysArray.length;j++){
		tlout.to(numDaysArray[j],0.5,{css:{marginTop:0,opacity:0}, ease:Expo.easeInOut,delay:j*(0.8/numDaysArray.length*0.5)},"start");
	}

	for(j=0;j<numDays;j++){
		tlout.to(controls.days[j],0.5,{val:-220, ease:Expo.easeInOut,delay:j*(0.8/numDays*0.5)},"start");
	}

	for(j=0;j<seasons.length;j++){
		tlout.staggerTo(controls.seasonsBig,1,{valEnd:Math.PI*2, ease:Expo.easeInOut},0.2,"start");
	}

	for(j=0;j<seasons.length;j++){
		tlout.staggerTo(controls.seasonsSmall,1,{valEnd:Math.PI*2, ease:Expo.easeInOut},0.2,"start");
	}

	tlout.play(0);

}

var dateTimeout

function updateDate(){

	dateTimeout = setTimeout(updateDate,1000);
	var t = new Date();
	var s = (t.getSeconds()+1)/60;
	var m = (t.getMinutes()+1)/60;
	var h = (t.getHours()+1)/24;
	TweenLite.to(secObj,0.2,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*s,onUpdate:draw});
	TweenLite.to(minObj,0.2,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*m,onUpdate:draw});
	TweenLite.to(hourObj,0.2,{val:(Math.PI*2/numDays)-(Math.PI*2/numDays)*h,onUpdate:draw});

	//start interaction loop
	
}
		
//Function: on mouse move
function onWindowMouseMove( event )
{
	var doc = document.documentElement, body = document.body;
	var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
	mouseX = event.clientX;
	mouseY = event.clientY + top;

	TweenLite.to($('#month-tooltip'),1,{css:{top:(mouseY+20)+'px',left:(mouseX+20)+'px'},ease:Expo.easeOut});
}
		
//Function : animate, main loop
function animate() {
	requestAnimationFrame( animate );
	//stats.update();
			
	update();
	draw();
}
		
//Function : Update
function update(){
	
}
		
//Function : draws the particles and text
function draw(){
	//Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	

	ctx.globalAlpha = 0.2;
	//Draw Circles
	//Draw Season White Circles
/*	for(i=0;i<seasons.length;i++){
		if(i<=todaySeason){
			ctx.beginPath();
			ctx.arc(screenWidth/2,screenHeight/2,45*(i+1),controls.seasonsSmall[i].val-Math.PI/2-Math.PI/3,controls.seasonsSmall[i].valEnd-Math.PI/2-Math.PI/3,true);
			ctx.lineWidth = 1;
	      	ctx.strokeStyle = '#ffffff';
	      	ctx.stroke();
	      	ctx.closePath();
	    }
	}*/

	

	for(i=0;i<seasons.length;i++){

		ctx.globalAlpha = 1;
		
      	if(i==currSeason){
      		ctx.save();
      		ctx.translate(screenWidth/2,screenHeight/2);
      		ctx.rotate((controls.seasonsBig[i].valEnd)/3*monthInSeason);
      		ctx.beginPath();
			ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].val)*(monthInSeason)/3-Math.PI/2-Math.PI/3,(controls.seasonsBig[i].valEnd)*(monthInSeason)/3-Math.PI/2-Math.PI/3,true);
			ctx.lineWidth = 35;
      		ctx.strokeStyle = colors[currSeason].seasonActive;
      		ctx.stroke();
      		ctx.closePath();
      		ctx.restore();

      		ctx.save();
      		ctx.translate(screenWidth/2,screenHeight/2);
      		ctx.rotate((controls.seasonsBig[i].val)/3*monthInSeason);
      		ctx.beginPath();
			ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].val)/3*(currDay/numDays)-Math.PI/2-Math.PI/3,(controls.seasonsBig[i].valEnd)/3*(currDay/numDays)-Math.PI/2-Math.PI/3,true);
			ctx.lineWidth = 35;
      		ctx.strokeStyle = colors[currSeason].monthActive;
      		ctx.stroke();
      		ctx.closePath();
      		ctx.restore();

      		if(currSeason != todaySeason){
      			ctx.save();
	      		ctx.translate(screenWidth/2,screenHeight/2);
	      		ctx.rotate((controls.seasonsBig[i].val)/3*(monthInSeason+1));
	      		ctx.beginPath();
				ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].val)*(2-monthInSeason)/3-Math.PI/2-Math.PI/3,(controls.seasonsBig[i].valEnd)*(2-monthInSeason)/3-Math.PI/2-Math.PI/3,true);
				ctx.lineWidth = 35;
	      		ctx.strokeStyle = colors[currSeason].seasonActive;
	      		ctx.stroke();
	      		ctx.closePath();
	      		ctx.restore();
      		}

      		for(j=0;j<controls.seasonsBig[i].months.length;j++){
	      		ctx.save();
	      		ctx.translate(screenWidth/2,screenHeight/2);
	      		ctx.rotate(Math.PI*2/3*j);
	      		ctx.beginPath();
				ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].months[j].val)/3-Math.PI/2-Math.PI/3,-Math.PI/2-Math.PI/3,true);
				ctx.lineWidth = 35;
	      		ctx.strokeStyle = colors[currSeason].monthActive;
	      		ctx.stroke();
	      		ctx.closePath();
	      		ctx.restore();
      		}
      	}
      	else if(i<todaySeason){
      		ctx.beginPath();
			ctx.arc(screenWidth/2,screenHeight/2,45*(seasons.length-i),controls.seasonsBig[i].val-Math.PI/2-Math.PI/3,controls.seasonsBig[i].valEnd-Math.PI/2-Math.PI/3,true);
			ctx.lineWidth = 35;
      		ctx.strokeStyle = colors[currSeason].seasonInactive;
      		ctx.stroke();
      		ctx.closePath();

      		for(j=0;j<controls.seasonsBig[i].months.length;j++){
      			ctx.save();
      			ctx.translate(screenWidth/2,screenHeight/2);
      			ctx.rotate(Math.PI*2/3*j);
      			ctx.beginPath();
				ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].months[j].val)/3-Math.PI/2-Math.PI/3,-Math.PI/2-Math.PI/3,true);
				ctx.lineWidth = 35;
      			ctx.strokeStyle = colors[currSeason].monthActive;
      			ctx.stroke();
      			ctx.closePath();
      			ctx.restore();
      		}

      		
      	}
      	else if(i==todaySeason) {

      		ctx.save();
      		ctx.translate(screenWidth/2,screenHeight/2);
      		ctx.beginPath();
			ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].val)*(todayMonthInSeason+1)/3-Math.PI/2-Math.PI/3,(controls.seasonsBig[i].valEnd)*(todayMonthInSeason+1)/3-Math.PI/2-Math.PI/3,true);
			ctx.lineWidth = 35;
      		ctx.strokeStyle = colors[currSeason].seasonInactive;
      		ctx.stroke();
      		ctx.closePath();
      		ctx.restore();

      		for(j=0;j<controls.seasonsBig[i].months.length;j++){
      			if(j<=todayMonthInSeason){
	      			ctx.save();
	      			ctx.translate(screenWidth/2,screenHeight/2);
	      			ctx.rotate(Math.PI*2/3*j);
	      			ctx.beginPath();
					ctx.arc(0,0,45*(seasons.length-i),(controls.seasonsBig[i].months[j].val)/3-Math.PI/2-Math.PI/3,-Math.PI/2-Math.PI/3,true);
					ctx.lineWidth = 35;
	      			ctx.strokeStyle = colors[currSeason].monthActive;
	      			ctx.stroke();
	      			ctx.closePath();
	      			ctx.restore();
	      		}
      		}
      	}

      	ctx.globalAlpha = 0.2;

      	for(j=0;j<3;j++){
      		ctx.save();
	      	ctx.translate(screenWidth/2,screenHeight/2);
	      	ctx.rotate(Math.PI*2/3*j-Math.PI/3);
	      	ctx.beginPath();
			ctx.moveTo(0,-45*(seasons.length-i)+35/2);
			ctx.lineTo(0,-45*(seasons.length-i)+35/2 -35*controls.lines.val);
			ctx.lineWidth = 1;
      		ctx.strokeStyle = '#ffffff';
      		ctx.stroke();
      		ctx.closePath();
	      	ctx.restore();
      	} 
      	
	}

	ctx.globalAlpha = 0.2;

	//External Circles
	/*for(i=0;i<=categories.length;i++){
		ctx.beginPath();
		ctx.arc(screenWidth/2,screenHeight/2,265+(45*i),controls.categories[i].val-Math.PI/2-Math.PI/3,-Math.PI/2-Math.PI/3,true);
		ctx.lineWidth = 1;
      	ctx.strokeStyle = '#ffffff';
      	ctx.stroke();
      	ctx.closePath();
	}*/

	//Lines
	for(i=0;i<numDays;i++){
		ctx.save();
		ctx.translate(screenWidth/2,screenHeight/2);
		ctx.rotate(Math.PI*2/numDays*i-Math.PI/3);
		ctx.beginPath();
		ctx.moveTo(0,-220);
		ctx.lineTo(0,controls.days[i].val);
		ctx.lineWidth = 1;
      	ctx.strokeStyle = '#ffffff';
      	ctx.stroke();
      	ctx.closePath();
      	ctx.restore();

	}

	ctx.globalAlpha = 1;
    //Draw Events
    //Draw Projects
    for(i=0;i<events.length;i++){
    	var ev = events[i];
    	var radius;
    	var color;
    	switch (ev.category) {
    		case 'project' :
    			radius = 288;
    			color = colors[currSeason].project;
    		break;
    		case 'case study':
    			radius = 288+45;
    			color = colors[currSeason].caseStudy;
    		break;
    		case 'stream':
    			radius = 288+90;
    			color = colors[currSeason].stream;
    		break;
    	}

    	var angle = Math.PI*2/numDays*(ev.date.getDate()-1)-Math.PI/2-Math.PI/3;
    	ctx.save();
    	ctx.translate(screenWidth/2,screenHeight/2);
    	ctx.rotate(angle);
    	ctx.beginPath();
    	ctx.arc(0,0,radius,(Math.PI*2/numDays)*controls.events[i].val,(Math.PI*2/numDays)*controls.events[i].valEnd,true);
    	ctx.lineWidth = 43;
      	ctx.strokeStyle = color;
      	ctx.stroke();
      	ctx.closePath();
      	ctx.restore();

      	ctx.save();
	    ctx.translate(screenWidth/2,screenHeight/2);
	    ctx.rotate(angle);
	    ctx.beginPath();
	    ctx.arc(0,0,radius,(Math.PI*2/numDays)*controls.events[i].over,0,true);
	    ctx.lineWidth = 43;
	    ctx.strokeStyle = colors[currSeason].eventOver;
	    ctx.stroke();
	    ctx.closePath();
	    ctx.restore();

      	ctx.beginPath();
    	ctx.arc(Math.cos(angle+Math.PI/numDays)*radius+screenWidth/2,Math.sin(angle+Math.PI/numDays)*radius+screenHeight/2,5*controls.events[i].overCircle,0,Math.PI*2,false);
      	ctx.fillStyle = colors[currSeason].eventOverCircle;
      	ctx.fill();
      	ctx.closePath();
      	
    }

    if(currSeason == todaySeason && currMonth == todayMonth){
		ctx.globalAlpha = 0.3;
		ctx.save();

		ctx.translate(screenWidth/2,screenHeight/2);
		ctx.rotate(-Math.PI/3-Math.PI/2);
		ctx.beginPath();
	    ctx.moveTo(0,0);
	    ctx.lineTo(Math.cos(0)*screenWidth,Math.sin(0)*screenWidth);
	    for(i=0;i<10;i++){
	    	//ctx.lineTo(Math.cos(restOfDay.val/((10-i)/10))*200,Math.sin(restOfDay.val/((10-i)/10))*200);
		}

		
		ctx.lineTo(Math.cos((restOfDay.val)*1/4)*screenWidth,Math.sin((restOfDay.val)*1/4)*screenWidth);
		ctx.lineTo(Math.cos((restOfDay.val)*2/4)*screenWidth,Math.sin((restOfDay.val)*2/4)*screenWidth);
		ctx.lineTo(Math.cos((restOfDay.val)*3/4)*screenWidth,Math.sin((restOfDay.val)*3/4)*screenWidth);

		ctx.lineTo(Math.cos((restOfDay.val))*screenWidth,Math.sin((restOfDay.val))*screenWidth);
	    ctx.lineTo(0,0);
	    ctx.fillStyle = colors[currSeason].restOfDays;
	    ctx.fill();
	    ctx.closePath();
	    ctx.restore();

	    ctx.save();
	    ctx.translate(screenWidth/2,screenHeight/2);
		ctx.rotate(-Math.PI/3);

	    var currAngle = -Math.PI/2-(restDays*(Math.PI*2/numDays)+currDayObj.val);
	    var currAngle2 = -Math.PI/2-((restDays+1)*(Math.PI*2/numDays));
	    ctx.beginPath();
	    ctx.moveTo(0,0);
	    ctx.lineTo(Math.cos(currAngle)*screenWidth,Math.sin(currAngle)*screenWidth);
		ctx.lineTo(Math.cos(currAngle2)*screenWidth,Math.sin(currAngle2)*screenWidth);
	    ctx.lineTo(0,0);
	    ctx.fillStyle = colors[currSeason].restOfDays;
	    ctx.fill();
	    ctx.closePath();


	    ctx.globalAlpha = 1;

	    //draw sec
	    var currAngleSec = -Math.PI/2-(restDays*(Math.PI*2/numDays)+secObj.val);
	    var currAngleSec2 = -Math.PI/2-((restDays+1)*(Math.PI*2/numDays));
	    ctx.beginPath();
		ctx.arc(0,0,360,currAngleSec2,currAngleSec);
		ctx.lineWidth = 15;
	    ctx.strokeStyle = colors[currSeason].sec;
	    ctx.stroke();

	    //draw min
	    var currAngleMin = -Math.PI/2-(restDays*(Math.PI*2/numDays)+minObj.val);
	    var currAngleMin2 = -Math.PI/2-((restDays+1)*(Math.PI*2/numDays));
	    ctx.beginPath();
		ctx.arc(0,0,376,currAngleMin2,currAngleMin);
		ctx.lineWidth = 15;
	    ctx.strokeStyle = colors[currSeason].min;
	    ctx.stroke();

	    //draw hours
	    var currAngleH = -Math.PI/2-(restDays*(Math.PI*2/numDays)+hourObj.val);
	    var currAngleH2 = -Math.PI/2-((restDays+1)*(Math.PI*2/numDays));
	    ctx.beginPath();
		ctx.arc(0,0,392,currAngleH2,currAngleH);
		ctx.lineWidth = 15;
	    ctx.strokeStyle = colors[currSeason].hours;
	    ctx.stroke();

	    ctx.restore();
	}

   
}

var isMonthOver = false;
var prevMonthOver = false;
var overMonth = -1;
var overEvent = -1;
var shouldInteract = true;

function testInteraction(){
	if(shouldInteract){
		requestAnimationFrame( testInteraction );
	}

	// DETECT MOUSE INTERACTION
    // Fomula to detect if a point is in a circle : (x - center_x)^2 + (y - center_y)^2 < radius^2

    //detect if cursor is in the project category circle
    var mouseDist = pointsDistance({posX:mouseX,posY:mouseY},{posX:screenWidth/2,posY:screenHeight/2});
    var mouseAngle = calcAngle(screenWidth/2,mouseX,screenHeight/2,mouseY);

    var isOver = false;
    isMonthOver = false;
    for(i=0;i<events.length;i++){
    	var ev=events[i];
    	var radius;
    	switch (ev.category) {
    		case 'project' :
    			radius = 288;
    		break;
    		case 'case study':
    			radius = 288+45;
    		break;
    		case 'stream':
    			radius = 288+90;
    		break;
    	}
    	var angle = Math.PI*2/numDays*(ev.date.getDate()-1)-Math.PI/2-Math.PI/3;

    	if(mouseDist<radius+44/2 && mouseDist>radius-44/2 && mouseAngle > angle && mouseAngle < (angle+Math.PI*2/numDays)){
	    	isOver = true;
	    	if(!ev.isOver){
	    		overEvent = i+0;
	    		onEventOver();
	    	}
	    	ev.isOver = true;
	    	continue;
	    }
	    else{
	    	if(ev.isOver){
	    		onEventOut();
	    	}
	    	ev.isOver = false;
	    }
    }

    var shouldAnimateOver = -1;
	var shouldAnimateOut = -1;

    for(i=0;i<seasons.length;i++){
    	if(i<=todaySeason){
	    	var radius = 45*(seasons.length-i);
	    	
	    	for(j=0;j<controls.seasonsBig[i].months.length;j++){

		    	var month=controls.seasonsBig[i].months[j];
		    	var angle = Math.PI*2/3*j-Math.PI/2-Math.PI/3;
		    	
		    	if(mouseDist<radius+35/2 && mouseDist>radius-35/2 && mouseAngle > angle && mouseAngle < (angle+Math.PI*2/3)){
			    	isOver = true;
			    	isMonthOver = true;
			    	if(i == 0){ //winter
			    		if(j==0){
			    			overMonth = 11;
			    		}
			    		else{
			    			overMonth = j-1;
			    		}
			    	}
			    	else if(i == 1){
			    		overMonth = j+2;
			    	}
			    	else if(i == 2){
			    		overMonth = j+5;
			    	}
			    	else{
			    		overMonth = j+8;
			    	}
			    	
			    	if(!month.isOver){
			    		TweenLite.to(controls.seasonsBig[i].months[j],0.5,{val:Math.PI*2, ease:Expo.easeOut,onUpdate:draw});
			    		$('.month-tooltip-copy').html(monthStrs[overMonth]);
			    		TweenLite.to($('.month-tooltip-container'),0.5,{css:{width:'40px'},ease:Expo.easeOut});
			    	}
			    	shouldAnimateOver = 1;
			    	month.isOver = true;
			    	continue;
			    }
			    else{
			    	if(month.isOver){
			    		TweenLite.to(controls.seasonsBig[i].months[j],0.5,{val:0, ease:Expo.easeOut,onUpdate:draw});
			    	}
			    	shouldAnimateOut = 1;
			    	month.isOver = false;
			    }

			}
			
		}
		
    }

	if(!isMonthOver && prevMonthOver){
		TweenLite.to($('.month-tooltip-container'),0.5,{css:{width:'0px'},ease:Expo.easeOut});
	}

	prevMonthOver = isMonthOver;


    if(isOver){
    	container.style.cursor = 'pointer';
    }
    else{
    	container.style.cursor = 'auto';
    }
    
}

function onDocClick(){
	if(isMonthOver && overMonth != currMonth){
		animateOut();
		shouldInteract = false;
		clearTimeout(dateTimeout);
		for(i=0;i<seasons.length;i++){
			for(j=0;j<3;j++){
				TweenLite.to(controls.seasonsBig[i].months[j],0.5,{val:0, ease:Expo.easeOut,onUpdate:draw});
			}
		}
	}
}

function onEventOver(){
	$('#top').html(data.find('event').eq(overEvent).find('title').text());
	$('#bottom').html(data.find('event').eq(overEvent).find('headline').text());

	TweenLite.to($('.copy-container').eq(0),0.5,{css:{width:$('#top').innerWidth()+'px'},ease:Expo.easeInOut,delay:0.1});
	TweenLite.to($('.copy-container').eq(1),0.5,{css:{width:$('#bottom').innerWidth()+'px'},ease:Expo.easeInOut,delay:0.3});

	TweenLite.to(controls.events[overEvent],0.5,{over:1,overCircle:1, ease:Expo.easeOut,onUpdate:draw});
}

function onEventOut(){
	TweenLite.to($('.copy-container').eq(0),0.4,{css:{width:'0px'},ease:Expo.easeInOut});
	TweenLite.to($('.copy-container').eq(1),0.4,{css:{width:'0px'},ease:Expo.easeInOut});

	TweenLite.to(controls.events[overEvent],0.5,{over:0,overCircle:0, ease:Expo.easeOut,onUpdate:draw});
}

function pointsDistance( p1, p2 ){
	var xs = 0;
	var ys = 0;
			 
	xs = p2.posX - p1.posX;
	xs = xs * xs;
			 
	ys = p2.posY - p1.posY;
	ys = ys * ys;
			 
	return Math.sqrt( xs + ys );
}

function onWindowResize(event){
	
	screenWidth = $(window).width();
	if($(window).height()<900){
		screenHeight = 900;
	}
	else{
		screenHeight = $(window).height();
	}

	canvas.width = screenWidth;	
	canvas.height = screenHeight;
	$('#bg').css('width',(screenWidth)+'px');
	$('#bg').css('height',(screenHeight)+'px');

	draw();

	
	var bgWidth,bgHeight;
	var windowRatio = screenWidth/screenHeight;

	if(bgRatio>windowRatio){
		bgHeight = screenHeight;
		bgWidth = bgHeight*bgRatio;
	}
	else{
		bgWidth = screenWidth;
		bgHeight = bgWidth/bgRatio;
	}

	$('#bg').find('video').css('width',bgWidth+'px');
	$('#bg').find('video').css('height',bgHeight+'px');

	$('#bg').find('video').css('marginLeft',((screenWidth-bgWidth)/2)+'px');
	$('#bg').find('video').css('marginTop',((screenHeight-bgHeight)/2)+'px');
}



//Util functions
//Function : Calculate angle between 2 points
function calcAngle(x1, x2, y1, y2){
	var calcAngle = -Math.atan2(x1-x2,y1-y2);
	if(calcAngle<-Math.PI/3){
		calcAngle = Math.PI*2+calcAngle;
	}
	else{
		
	}
	calcAngle -= Math.PI/2;
	return calcAngle;
}

function daysInMonth(month,year) {
    return new Date(year, month+1, 0).getDate();
}