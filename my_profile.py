import requests
import json

def save_my_stats():
	res = requests.get("https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/5908?api_key=RGAPI-bbf1115c-5e1a-4b18-8c3c-a9326ee5ce37")
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