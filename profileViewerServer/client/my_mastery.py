import requests
import json


def save_my_mastery():
	res = requests.get("https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/5908?api_key=RGAPI-c87af80c-b252-479c-9ad6-644876477265")
	my_mastery = res.json()
	with open("my_mastery.json", "w") as f:
		f.write(json.dumps(my_mastery, sort_keys = True))

def get_my_mastery():
	with open('my_mastery.json') as f:
		my_mastery = json.load(f)
	return my_mastery

def save_riot_champs():
	res = requests.get("http://ddragon.leagueoflegends.com/cdn/8.13.1/data/en_US/champion.json")
	my_champs = res.json()
	with open("champion.json", "w") as f:
		f.write(json.dumps(my_champs, sort_keys=True))

def get_riot_champs():
	with open('champion.json') as f:
	    riot_champs = json.load(f)
	return riot_champs

def get_id_to_name_map():
	riot_champs = get_riot_champs()["data"]
	id_to_name_map = {}
	for name,champion_info in riot_champs.items():
		id_to_name_map[champion_info["key"]] = name
	return id_to_name_map

def get_mastery_level():
	my_mastery = get_my_mastery()
	mastery = {}
	for items in range(len(my_mastery)):
		mastery.update({my_mastery[items]["championId"]:my_mastery[items]["championLevel"]})
	return mastery

def get_mastery_points():
	my_mastery = get_my_mastery()
	mastery = {}
	for items in range(len(my_mastery)):
		mastery.update({my_mastery[items]["championId"]:my_mastery[items]["championPoints"]})
	return mastery

def match_name_to_mastery():
	mastery_level = get_mastery_level()
	mastery_points = get_mastery_points()
	id_to_name_map = get_id_to_name_map()
	matched_levels = []
	for key in mastery_level:
		for key2 in mastery_points:
			if(key == key2):
				champion_name = id_to_name_map[str(key)]
				level = mastery_level[key]
				points = mastery_points[key2]
				champ_id = key
				champ_url = "http://ddragon.leagueoflegends.com/cdn/8.13.1/img/champion/" + champion_name + ".png"
				single_champ = {}
				single_champ["Champion"] = " " + champion_name
				single_champ["Mastery Level"] = level
				single_champ["Mastery Points"] = points
				single_champ["Id"] = champ_id
				single_champ["Url"] = champ_url
				matched_levels.append(single_champ)
	matched_levels = sorted(matched_levels, key=lambda x: x["Mastery Level"], reverse=True)
	print(single_champ["Mastery Points"])
	# with open ("matched_levels.json", "w") as f:
		# f.write(json.dumps(matched_levels, sort_keys = True))



def main():
	match_name_to_mastery()


if __name__ == '__main__':
	main()
