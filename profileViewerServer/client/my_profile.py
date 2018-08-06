import requests
import json

def save_my_stats():
	res = requests.get("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/dyrus?api_key=RGAPI-c87af80c-b252-479c-9ad6-644876477265")
	my_stats = res.json()
	with open("my_stats.json", "w" ) as f:
		f.write(json.dumps(my_stats, sort_keys=True))


# def get_my_stats():
# 	with open('my_stats.json') as f:
# 	    my_stats = json.load(f)
# 	print(my_stats)
# 	return my_stats

# def get_points():
# 	my_stats = get_my_stats()
# 	points = {}
# 	points = (my_stats[0])["leaguePoints"]
# 	return points

# def get_wins():
# 	my_stats = get_my_stats()
# 	wins = {}
# 	wins = (my_stats[0])["wins"]
# 	return wins

# def get_losses():
# 	my_stats = get_my_stats()
# 	losses = (my_stats[0])["losses"]
# 	return losses

# def get_rank():
# 	my_stats = get_my_stats()
# 	tier = (my_stats[0])["tier"]
# 	rank = (my_stats[0])["rank"]
# 	total_rank = tier + " " + rank
# 	print(total_rank)
# 	return total_rank



def main():
	save_my_stats()
	# get_my_stats()
	# get_wins()
	# print(get_losses())
	# get_points()
	

if __name__ == '__main__':
	main()