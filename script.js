var time = localStorage.totalTime; 
var mins = 0;
var secs = 0;
var count = localStorage.total; 
var list = localStorage.exercises;

// notes: local storage total = # of sets to do, NEVER changes
// count starts at total and goes towards 0
function getInfo() {
	var core = document.getElementById("core").checked;
	var cardio = document.getElementById("cardio").checked;
	var arms = document.getElementById("arms").checked;
	var legs = document.getElementById("legs").checked;
	var back = document.getElementById("back").checked;
	var map = {};
	map["core"] = core;
	map["cardio"] = cardio;
	map["arms"] = arms;
	map["legs"] = legs;
	map["back"] = back;

	var exercises = []
	var count = 0;
	for (var key in map) {
		if (map[key]) {
			count++;
			exercises.push(key);
		}
	}
	if (exercises.length == 0) {
		alert("Please select at least one exercise type!");
		return; // error catching
	}
	localStorage.setItem("exercises", JSON.stringify(exercises));
	process(count);
}

function process(count) {
	var time = document.getElementById("time").value;
	localStorage.setItem("totalTime", time);
	// if splitting up time is > 5min, then total will just be how many segments of 2min workouts can be done instead
	localStorage.setItem("total", time / count > 2 ? time / 2 : count);
	window.location.href = "workoutstart.html";
}

// timer
function countdown() {
	changeDiv(document.getElementById("workout")); // change div to appropriate workout
	mins = Math.min(time / localStorage.total, 2);
	secs = mins * 60;
	setTimeout('changeMsg()', 3000);
	setTimeout('Decrement()', 3000);
}

function changeMsg() {
	document.getElementById("update").innerText = "Let's go!";
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// gets a random workout from list
function getWorkout() {
	var list = JSON.parse(localStorage.exercises); // parsed list of exercises
	var index = (localStorage.total - count) % list.length;
	var workoutType = list[index]; // current exercise type
	var ex = Workout.instances[workoutType]; // list of corresponding exercises
	return ex[getRandomInt(0, ex.length)];
}

function changeDiv(div) {
	var workout = getWorkout();
	div.innerHTML = "<h3>" + workout.name + "</h3> <br><div style=\"font-size:15px\">"
		 + workout.descrip + "</div>";
}

function playAudio(){
var aud = ["audio/GetFit.wav","audio/GitFitEmojee.wav","audio/GreatJob.wav","audio/KeepGoing.wav","audio/MusclesDont.wav","audio/TheGrindNeverStops.wav","audio/YouCanDoIt.wav"];
var item = aud[Math.floor(Math.random()*aud.length)];
var audio = new Audio();
audio.src = item;
audio.play();

}

function Decrement() {
	if (document.getElementById) {
		minutes = document.getElementById("minutes");
		seconds = document.getElementById("seconds");
		// if less than a minute remaining
		if (seconds < 59) {
			seconds.value = ("0" + secs).slice(-2);
		} else {
			minutes.value = ("0" + getminutes()).slice(-2);
			seconds.value = ("0" + getseconds()).slice(-2);
		}
		if(getminutes()==0&&getseconds()==0)
			restart();
		else {
			if(getseconds()==30)
			playAudio();
			setTimeout('Decrement()',1000);
			secs--;
		}
	
	}
	
}
function getminutes() {
	// minutes is seconds divided by 60, rounded down
	mins = Math.floor(secs / 60);
	return mins;
}
function getseconds() {
	// take mins remaining (as seconds) away from total seconds remaining
	return secs-Math.round(mins *60);
}

function restart(){
	//alert("Hello");
	count--;
	if (count > 0) {
		document.getElementById("update").innerText = "Upcoming exercise";
		setTimeout('countdown()', 1000);
		// countdown();
	} else {
		document.getElementById("update").innerText = "Congrats! You did it!";
	}
}


function start() {
	if (core.length == 0)
		Workout.data(); // init
	// document.getElementById("start").disabled = true;
	document.getElementById("update").innerText = "Upcoming exercise";
	countdown();
}

// workouts
Workout.instances = {};
var core = [];
var cardio = [];
var arms = [];
var legs = [];
var back = [];


function Workout(slots) {
	this.name = slots.name;
	this.area = slots.area;
	this.descrip = slots.descrip;
};

Workout.data = function() {

	core.push(new Workout({name:"Crunches", area:"core", descrip:"Lay on your back with your legs bent at the knees. Slowly raise your shoulders a few inches off the ground by contracting your abs, and return to the starting position."}));
	cardio.push(new Workout({name:"Jumping Jacks", area:"cardio", descrip:"Stand normally, then jump your feet out to the sides and raise your arms over your head before returning to the starting position."}));
	arms.push(new Workout({name:"Tricep Dips", area:"arms", descrip:"Place your hands shoulder-width apart on a stable surface. Hold yourself with your arms straight and your legs extended in front of you. Slowly lower your arms into a 90-degree angle, and then straighten."}));
	legs.push(new Workout({name:"Squats", area:"legs", descrip:"Stand with your feet apart, look straight ahead and hold your arms straight out in front of you. Lower your hips into a squat, keeping your knees over your feet and your back straight."}));
	legs.push(new Workout({name:"Lunges", area:"legs", descrip:"Step forward with one foot at a time, lowering until your knees are both at 90-degree angles. Make sure your front knee stays over your foot and your back knee doesn't touch the ground."}));
	core.push(new Workout({name:"Russian Twists", area:"core", descrip:"Sit on the ground with your knees bent. Your upper body should create a V-shape with your thighs. Extend your arms out fully in front of you, and then turn to each side until they're parallel to the ground."}));
	legs.push(new Workout({name:"Calf Raises", area:"legs", descrip:"Stand on the edge of a step or something elevated, with your heels hanging off the back and your toes on the ground. Raise your heels so you're on tiptoe, and then lower them so they're below the edge of the platform."}));
	arms.push(new Workout({name:"Push Ups", area:"arms", descrip:"Get into a plank position. Lower your body so that your chest gets as close to the ground as possible. Pull your elbows back as you descend, and keep your body straight."}));
	core.push(new Workout({name:"Plank", area:"core", descrip:"Get into a push-up position, placing your forearms on the ground. Hold yourself up using your core."}));
	cardio.push(new Workout({name:"Lunge Split Jumps", area:"cardio", descrip:"Get in a lunge position with one foot forward. Jump as high as possible, bringing your feet together, and then return to a lunge with the opposite leg forward."}));
	core.push(new Workout({name:"Sit-ups", area:"core", descrip:"Lay on your back with your legs bent at the knees and your arms crossed on your chest. Lift your head, shoulder and back off the ground until you're sitting up, and then lower down again."}));
	back.push(new Workout({name:"Bird-dogs", area:"back", descrip:"Get on all fours with your knees and hands on the ground, looking at the floor. Extend one arm straight out in front of you and the opposite leg behind you. Repeat with the opposite side."}));
	core.push(new Workout({name:"Oblique Crunches", area:"core", descrip:"Lay on your back with your legs bent at the knees. Perform a crunch, but bring your elbow up to the opposite knee."}));
	legs.push(new Workout({name:"Side Lunges", area:"legs", descrip:"Stand straight with your feet shoulder-width apart and your hands clasped in front of you. Take a lateral step out to one side, bending the knee you step with and keeping the other straight. Straighten the leg you stepped with to lunge to the other side."}));
	cardio.push(new Workout({name:"Butt Kickers", area:"cardio", descrip:"Stand normally, and then run in place, bringing your heels up to your butt each time."}));
	arms.push(new Workout({name:"Small Arm Circles", area:"arms", descrip:"Extend your arms straight out to your sides. Move them in small, quick circles."}));
	arms.push(new Workout({name:"Big Arm Circles", area:"arms", descrip:"Extend your arms straight out to your sides. Move them in large, wide circles."}));
	arms.push(new Workout({name:"Plank Ups", area:"arms", descrip:"Start in a high plank position. Lower one forearm to the ground, then the other, until you're in a low plank. Then straighten one arm at a time into a high plank."}));
	back.push(new Workout({name:"Supermans", area:"back", descrip:"Lie facedown on the ground. Reach your arms and legs straight out into the air so it looks like you're doing a superman pose, and then lower."}));
	back.push(new Workout({name:"Bridge", area:"back", descrip:"Lay on your back with your legs bent at the knees. Lift your pelvis up to the ceiling and then lower it again."}));
	Workout.instances["arms"] = arms;
	Workout.instances["core"] = core;
	Workout.instances["legs"] = legs;
	Workout.instances["back"] = back;
	Workout.instances["cardio"] = cardio;
};

// ???
// exercise panel shifting
function paginate() {
	var types = initMap();

}

function initMap() {
	var types = {};
	types.push({name:"Crunches"; img:"Exercise_Photos/Crunches.jpg"; desc:"Lay on your back with your legs bent at the knees. Slowly raise your shoulders a few inches off the ground by contracting your abs, and return to the starting position."});
	types.push({name:"Jumping Jacks"; img:"Exercise_Photos/JumpingJacks.jpg"; desc:"Stand normally, then jump your feet out to the sides and raise your arms over your head before returning to the starting position."});
	types.push({name:"Tricep Dips"; img:"Exercise_Photos/TricepDips.jpg"; desc:"Place your hands shoulder-width apart on a stable surface. Hold yourself with your arms straight and your legs extended in front of you. Slowly lower your arms into a 90-degree angle, and then straighten."});
	types.push({name:"Squats"; img:"Exercise_Photos/Squats.jpg"; desc:"Stand with your feet apart, look straight ahead and hold your arms straight out in front of you. Lower your hips into a squat, keeping your knees over your feet and your back straight."});
	types.push({name:"Lunges"; img:"Exercise_Photos/Lunges.jpg"; desc:"Step forward with one foot at a time, lowering until your knees are both at 90-degree angles. Make sure your front knee stays over your foot and your back knee doesn’t touch the ground."});
	types.push({name:"Russian Twists"; img:"Exercise_Photos/RussianTwists.png"; desc:"Sit on the ground with your knees bent. Your upper body should create a V-shape with your thighs. Extend your arms out fully in front of you, and then turn to each side until they’re parallel to the ground."});
	types.push({name:"Calf Raises"; img:"Exercise_Photos/CalfRaises.jpg"; desc:"Stand on the edge of a step or something elevated, with your heels hanging off the back and your toes on the ground. Raise your heels so you’re on tiptoe, and then lower them so they’re below the edge of the platform."});
	types.push({name:"Push Ups"; img:"Exercise_Photos/PushUps.jpg"; desc:"Get into a plank position. Lower your body so that your chest gets as close to the ground as possible. Pull your elbows back as you descend, and keep your body straight."});
	types.push({name:"Plank"; img:"Exercise_Photos/Plank.jpg"; desc:"Get into a push-up position, placing your forearms on the ground. Hold yourself up using your core."});
	types.push({name:"Lunge Split Jumps"; img:"Exercise_Photos/LungeSplitJumps.jpg"; desc:"Get in a lunge position with one foot forward. Jump as high as possible, bringing your feet together, and then return to a lunge with the opposite leg forward."});
	types.push({name:"Sit Ups"; img:"Exercise_Photos/SitUps.jpg"; desc:"Lay on your back with your legs bent at the knees and your arms crossed on your chest. Lift your head, shoulder and back off the ground until you’re sitting up, and then lower down again."});
	types.push({name:"Bird-Dogs"; img:"Exercise_Photos/BirdDogs.jpg"; desc:"Get on all fours with your knees and hands on the ground, looking at the floor. Extend one arm straight out in front of you and the opposite leg behind you. Repeat with the opposite side."});
	types.push({name:"ObliqueCrunches"; img:"Exercise_Photos/ObliqueCrunches.jpg"; desc:"Lay on your back with your legs bent at the knees. Perform a crunch, but bring your elbow up to the opposite knee."});
	types.push({name:"Side Lunges"; img:"Exercise_Photos/SideLunges.jpg"; desc:"Stand straight with your feet shoulder-width apart and your hands clasped in front of you. Take a lateral step out to one side, bending the knee you step with and keeping the other straight. Straighten the leg you stepped with to lunge to the other side."});
	types.push({name:"ButtKickers"; img:"Exercise_Photos/ButtKickers.jpg"; desc:"Stand normally, and then run in place, bringing your heels up to your butt each time."});
	types.push({name:"Small Arm Circles"; img:"Exercise_Photos/SmallArmCircles.jpg"; desc:"Extend your arms straight out to your sides. Move them in small, quick circles."});

	types.push({name:"Big Arm Circles"; img:"Exercise_Photos/BigArmCircles.jpg"; desc:"Extend your arms straight out to your sides. Move them in large, wide circles."});
	types.push({name:"Plank Ups"; img:"Exercise_Photos/PlankUps.jpg"; desc:"Start in a high plank position. Lower one forearm to the ground, then the other, until you’re in a low plank. Then straighten one arm at a time into a high plank."});
	types.push({name:"Supermans"; img:"Exercise_Photos/Supermans.jpg"; desc:"Lie facedown on the ground. Reach your arms and legs straight out into the air so it looks like you’re doing a superman pose, and then lower."});
	types.push({name:"Bridge"; img:"Exercise_Photos/Bridge.jpg"; desc:"Lay on your back with your legs bent at the knees. Lift your pelvis up to the ceiling and then lower it again."});
	return types;
}