# scrapes NA accounts w/ play rate to check if we are capturing all games in NA
# Can't run this during peak OP.GG times ?

import requests
# test curl time
# curl -w "@curl-format.txt" -o /dev/null -s
# "https://na.op.gg/ranking/ajax2/ladders/start=0"

# scrapes op.gg for masters
# http://www.op.gg/champion/ajax/statistics/summonerRanking/championId=103

from bs4 import BeautifulSoup
import requests
import json
from static.common import save
import csv
import math
import concurrent.futures
import time

# takes an hour to run on my machine


def get_summoners_count_url(region_name):
    if region_name == "kr":
        region_name = "www"
    url = "http://{}.op.gg/ranking/ladder/".format(region_name)
    return url


def get_summoners_count(region_name):
    url = get_summoners_count_url(region_name)
    res = requests.get(url)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')
    page_desc = soup.findAll("div", {"class": "PageDescription"})
    cur_summoners = page_desc[0].findAll("span", {"class": "Text"})
    # Assume text is of the form:
    # There are currently 1,438,882 summoners on Summoner's Rift
    summoner_count_text = cur_summoners[0].text
    summoner_count_text = summoner_count_text.replace(
        "There are currently ", "")
    summoner_count_text = summoner_count_text.replace(
        " summoners on Summoner's Rift", "")
    summoner_count_text = summoner_count_text.replace(",", "")
    return int(summoner_count_text)


def get_url(region_name, start=0):
    if region_name == "kr":
        region_name = "www"
    url = "https://{}.op.gg/ranking/ajax2/ladders/start={}".format(
        region_name, start)
    return url


def get_ladder_players(region_name, start=0):
    url = get_url(region_name, start)
    ladder_html = requests.get(url)
    return parse_data(ladder_html.text)


def parse_data(html):
    soup = BeautifulSoup(html, 'html.parser')
    player_rows = soup.findAll("tr")
    players = []
    for tr in player_rows:
        cur_player = []
        for td in tr.findAll("td"):
            cur_player.append(td.text.strip())
        if cur_player[0] == "Show More":
            continue
        wins_losses = get_wins_losses(cur_player[5])
        cur_player_obj = {
            "rank": cur_player[0],
            "account": cur_player[2],
            "lol_rank": cur_player[3],
            "lol_rank_lp": cur_player[4],
            "wins": wins_losses["wins"],
            "losses": wins_losses["losses"],
            "total": wins_losses["total"]
        }

        cur_player_cleaned = [
            int(cur_player_obj["rank"]),
            cur_player_obj["account"],
            cur_player_obj["lol_rank"],
            cur_player_obj["lol_rank_lp"],
            cur_player_obj["wins"],
            cur_player_obj["losses"],
            cur_player_obj["total"]
        ]

        players.append(cur_player_cleaned)
    return players


def get_wins_losses(wins_losses_str):
    # looks like '10\n\n0%' for 0% win rate
    # looks like '10\n\n100%' for 100% win rate
    # looks like '256\n\n206\n\n\n55%' for mixed win rate
    wins = 0
    losses = 0

    text_split = wins_losses_str.split("\n")
    if "0%" in wins_losses_str:
        losses = int(text_split[0])
        wins = 0
    elif "100%" in wins_losses_str:
        wins = int(text_split[0])
        losses = 0
    else:
        wins = int(text_split[0])
        losses = int(text_split[2])

    return {"wins": wins, "losses": losses, "total": wins + losses}


def load_url(url, timeout):
    ans = requests.get(url, timeout=timeout)
    data = parse_data(ans.text)
    return data


def fast_scrape(urls, save_file_path):
    out = []
    CONNECTIONS = 2
    TIMEOUT = 10
    start_time = time.time()

    # tlds = open('test_urls.txt').read().splitlines()
    # urls = [x for x in tlds]

    with concurrent.futures.ThreadPoolExecutor(max_workers=CONNECTIONS) as executor:
        future_to_url = {executor.submit(
            load_url, url, TIMEOUT): url for url in urls}

    for future in concurrent.futures.as_completed(future_to_url):
        try:
            data = future.result()
        except Exception as exc:
            print("Exception: {}".format(exc))
            data = str(type(exc))
        finally:
            out.append(data)
            # print(str(len(out)), end="\r")

    end_time = time.time()

    print('Took {:.2f} s'.format((end_time - start_time)))
    # print(str(pd.Series(out).value_counts()))

    flat_list = [player for player_list in out for player in player_list]
    flat_list = sorted(flat_list, key=lambda x: int(x[0]))

    with open(save_file_path, "w", encoding="utf8") as f:
        f_writer = csv.writer(f, delimiter=",")
        for player in flat_list:
            f_writer.writerow(player)


def main():
    region_name = "na"
    count = get_summoners_count(region_name)
    opgg_accounts_per_page = 50
    # save our files into different shards so that we can track
    # our progress instead of saving everything at one time
    # this is the number of http requests we are making per file
    our_shard_size = 100

    pages = math.ceil(count / opgg_accounts_per_page)
    shards = math.ceil(pages / our_shard_size)

    for i in range(120, shards):
        urls = []
        start = i * our_shard_size * opgg_accounts_per_page
        # end = (i + 1) * our_shard_size * opgg_accounts_per_page

        for j in range(our_shard_size):
            cur_index = start + opgg_accounts_per_page * j
            if cur_index < count:
                urls.append(get_url(region_name, cur_index))

        fast_scrape(urls, "./data/shard_{}.csv".format(i))


if __name__ == "__main__":
    main()
