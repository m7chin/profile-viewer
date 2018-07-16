import requests 
import json


def save_my_champs():
	res = requests.get("https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/49654475?api_key=RGAPI-332325b0-8aba-4da1-be39-d74ecc98a20c")
	my_champs = res.json()
	with open("my_champs.json", "w") as f:
		f.write(json.dumps(my_champs, sort_keys=True))

def get_my_champs():
	with open('my_champs.json') as f:
	    my_champs = json.load(f)
	return my_champs

def get_riot_champs():
	with open('champions.json') as f:
	    riot_champs = json.load(f)
	return riot_champs

def get_id_to_name_map():
	riot_champs = get_riot_champs()["data"]
	id_to_name_map = {}
	for name,champion_info in riot_champs.items():
		id_to_name_map[champion_info["key"]] = name
	return id_to_name_map
	# print(id_to_name_map)

def get_play_count():
	id_to_name_map = get_id_to_name_map()
	my_champs = get_my_champs()["matches"]
	play_count = {}
	for match in my_champs:
		champ_id = match["champion"]
		if champ_id not in play_count:
			play_count[champ_id] = 0
		play_count[champ_id] = play_count[champ_id] + 1
	# print(play_count)
	return play_count
	

# def get_my_champ_count():
# 	# 1. Organize riots json to map id to name
# 	# 2. Iterate through my champs 
# 	# 3. Count times champ played

def match_name_to_play_count():
	champion_stats = []
	play_count = get_play_count()
	id_to_name_map = get_id_to_name_map()
	for key in play_count:
		champion_name = id_to_name_map[str(key)]
		count = play_count[key]
		champ_id = key
		champ_url = "http://ddragon.leagueoflegends.com/cdn/8.13.1/img/champion/" + champion_name + ".png"
		single_champ = {}
		single_champ["Champion"] = champion_name
		single_champ["Play Count"] = count
		single_champ["Id"] = champ_id
		single_champ["Url"] = champ_url
		champion_stats.append(single_champ)
	sorted_champs = sorted(champion_stats, key=lambda x: x["Play Count"], reverse=True)
	with open("sorted_champs.json", "w") as f:
		f.write(json.dumps(sorted_champs, sort_keys=True))

	
	




def main():
	match_name_to_play_count()
	

if __name__ == '__main__':
	main()
	# main()