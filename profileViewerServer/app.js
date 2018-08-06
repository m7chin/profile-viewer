var express = require('express');
var app = express();
const https = require('https');
var fs = require('fs');

var port = process.env.PORT || 3000;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/test', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.get('/musician/:name', function(req, res) {

   // Get /musician/Matt
   console.log(req.params.name)
   // => Matt

   let testObj = {"id": 1,"name": req.params.name,
     "band":"BBQ Brawlers"};

   res.send(testObj);
});

app.get('/', (req, res) => {
	res.send("Welcome to Best Site")
})

app.get("/home", (req, res) => {
	res.send("Home Page")
})

/////////////////////////////// CHAMPION PLAY LIST
function save_match_list(){
	var url = "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/49654475?api_key=RGAPI-cb202edd-5ae8-43d7-b9a6-16af08ef7c43";
	https.get(url, function(res){
		var champList = {}
    	var body = '';
    	res.on('data', function(chunk){
        	body += chunk;
    	});

    	res.on('end', function(){
    	   	champList = JSON.parse(body);
    	    fs.writeFileSync("champList.json", JSON.stringify(champList),"utf8" ,(err) =>{
    			if (err) throw err
    			console.log("file saved")
			});
   		});
	}).on('error', function(e){
      	console.log("Got an error: ", e);
	});
}

function save_id_to_name_map(){
	let riotList = JSON.parse(fs.readFileSync("./riotList.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	})).data
	let id_to_name_map = {}
	for(i = 0; i< Object.keys(riotList).length; i ++){
		id_to_name_map[Object.values(riotList)[i].key] = Object.keys(riotList)[i]
	}
	return id_to_name_map
}

function save_play_count(){
	let map = save_id_to_name_map()
	let my_champs = JSON.parse(fs.readFileSync("./champList.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	playCount = {}
	for(i = 0; i< my_champs.matches.length; i ++){
		champ_id = (my_champs).matches[i].champion
		if (champ_id in playCount === false){
			playCount[champ_id] = 0
		}
		playCount[champ_id] = playCount[champ_id] + 1
	}
	return playCount
}

function match_name_to_play_count(){
	champion_stats = []
	play_count = save_play_count()
	id_to_name_map = save_id_to_name_map()
	for(i = 0; i< Object.keys(play_count).length; i ++){
		champ_id = Object.keys(play_count)[i]
		champion_name = id_to_name_map[champ_id]
		count = play_count[champ_id]
		champ_url = "http://ddragon.leagueoflegends.com/cdn/8.13.1/img/champion/" + champion_name + ".png"
		single_champ = {}
		single_champ["Champion"] = champion_name
		single_champ["Play Count"] = count
		single_champ["Id"] = champ_id
		single_champ["Url"] = champ_url
		champion_stats.push(single_champ)
	}
	let sorted_champs = champion_stats.sort(compare('Play Count'))
	sorted_champs.reverse()
	return sorted_champs
}

let compare = function(property){
	return function(x,y){
		 return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
	}
}
//////////////////////////////

//////////////////////////////PROFILE NAME
function save_my_stats(){
	var url = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/fettymcfet?api_key=RGAPI-cb202edd-5ae8-43d7-b9a6-16af08ef7c43"
	https.get(url, function(res){
		var profile = {}
    	var body = '';
    	res.on('data', function(chunk){
        	body += chunk;
    	});

    	res.on('end', function(){
    	   	profile = JSON.parse(body);
    	    fs.writeFileSync("profile.json", JSON.stringify(profile),"utf8" ,(err) =>{
    			if (err) throw err
    			console.log("file saved")
			});
   		});
	})
}
//////////////////////////////

//////////////////////////////Profile Mastery
function save_my_mastery(){
	var url = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/35097502?api_key=RGAPI-5ac0cf94-d2ee-4e56-9850-98e6d0a0c910"
	https.get(url, function(res){
		var mastery = {}
    	var body = '';
    	res.on('data', function(chunk){
        	body += chunk;
    	});

    	res.on('end', function(){
    	   	mastery = JSON.parse(body);
    	    fs.writeFileSync("mastery.json", JSON.stringify(mastery),"utf8" ,(err) =>{
    			if (err) throw err
    			console.log("file saved")
			});
   		});
	})
}

function get_mastery(){
	let mastery_level = JSON.parse(fs.readFileSync("./mastery.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	mastery = {}
	champId = "championId"
	champLevel = "championLevel"
	for(i = 0; i < mastery_level.length; i++){
		mastery[mastery_level[i][champId]] = mastery_level[i][champLevel]
	}
	return(mastery)
}

function match_name_to_mastery(){
	mastery_level = get_mastery()
	id_to_name_map = save_id_to_name_map()
	matched_levels = []
	for(i = 0; i < Object.keys(mastery_level).length; i++){
		champ_id = Object.keys(mastery_level)[i]
		champion_name = id_to_name_map[champ_id]
		level = mastery_level[champ_id]
		champ_url = "http://ddragon.leagueoflegends.com/cdn/8.13.1/img/champion/" + champion_name + ".png"
		single_champ = {}
		single_champ["Champion"] = " " + champion_name
		single_champ["Mastery Level"] = level
		single_champ["Id"] = champ_id
		single_champ["Url"] = champ_url
		matched_levels.push(single_champ)
	}
	let sorted_level = matched_levels.sort(compare('Mastery Level'))
	sorted_level.reverse()
	return sorted_level
}
//////////////////////////////

//////////////////////////////Games played in a day

function calc_games_played_today(){
	// let gamesPlayed = JSON.parse(fs.readFileSync("../opgg\ scraper/gamesList.json", (err, data) =>{
	let gamesPlayed = JSON.parse(fs.readFileSync("./gamesList.json", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	listLength = Object.keys(gamesPlayed).length - 1
	if(listLength + 1 > 1){
		day2 = Object.values(gamesPlayed[listLength])[0]
		day1 = Object.values(gamesPlayed[listLength - 1])[0]
		console.log(day2)
		platDay1 = day1[0]['Platinum Games']
		platDay2 = day2[0]['Platinum Games']
		diamondDay1 = day1[1]['Diamond Games']
		diamondDay2 = day2[1]['Diamond Games']
		masterDay1 = day1[2]['Master Games']
		masterDay2 = day2[2]['Master Games']
		challengerDay1 = day1[3]['Challenger Games']
		challengerDay2 = day2[3]['Challenger Games']
		totalDay1 = day1[4]['Total Games']
		totalDay2 = day2[4]['Total Games']

		platToday = platDay2 - platDay1
		diamondToday = diamondDay2 -diamondDay1
		masterToday = masterDay2 - masterDay1
		challengerToday = challengerDay2 - challengerDay1
		totalToday = totalDay2 - totalDay1
		
		challengerGames = {}
		masterGames = {}
		diamondGames = {}
		platinumGames = {}
		totalGames = {}
		challengerGames["Challenger Games"] = (challengerToday)
		masterGames["Master Games"] = (masterToday)
		diamondGames["Diamond Games"] = (diamondToday)
		platinumGames["Platinum Games"] = (platToday)
		totalGames["Total Games"] = (totalToday)

		gamesPlayedToday = [platinumGames,diamondGames,masterGames,challengerGames,totalGames]
		console.log(Object.keys(gamesPlayedToday)[0])
		return gamesPlayedToday
	}
	else{
		return Object.values(gamesPlayed[0])[0]
	}
}

app.get("/matchlist/:update", (req, res) => { 
	if (req.params.update == "update"){
		save_match_list()
	}
	let champs = JSON.stringify(fs.readFileSync("./champList.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	res.send(champs)
})

app.get("/riotList", (req, res) => { 
	var url = "https://ddragon.leagueoflegends.com/cdn/8.13.1/data/en_US/champion.json";
	https.get(url, function(res){
    	var body = '';

    	res.on('data', function(chunk){
        	body += chunk;
    	});

    	res.on('end', function(){
    	   	let riotList = JSON.parse(body);
    	    fs.writeFileSync("riotList.json",JSON.stringify(riotList),"utf8" ,(err) =>{
    			if (err) throw err
    			console.log("file saved")
			});
   		});
	}).on('error', function(e){
      	console.log("Got an error: ", e);
	});
	let test = JSON.stringify(fs.readFileSync("./riotList.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	res.send(test)
})

app.get("/mapIdName", (req, res) => {
	let map = save_id_to_name_map()
	res.send(map)
})

app.get("/playCount", (req, res) =>{
	res.send(match_name_to_play_count())
})

app.get("/myProfile", (req, res) => {
	save_my_stats()
	let profile = JSON.stringify(fs.readFileSync("./profile.json","utf8", (err, data) =>{
		if (err) throw err;
		console.log("data read")
	}))
	res.send(profile)
})

app.get("/mastery", (req, res) => {
	res.send(match_name_to_mastery())
})

app.get("/allMatchesPlayed", (req, res) => {
	let matches = JSON.parse(fs.readFileSync("../opgg\ scraper/gamesList.json", "utf8", (err, data) =>{
		if (err) throw err;
	}))
	res.send(matches)
})

app.get("/gamesPlayedToday", (req,res) => {
	res.send(calc_games_played_today())
})
app.listen(port);
console.log('Now working on ' + port)

