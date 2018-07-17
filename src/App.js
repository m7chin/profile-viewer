import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import sortedChampData from './data/sorted_champs.json';
import myStats from './data/my_stats.json';
import "./style.css";


class ChampData extends Component {
  render() {
    let championData = this.props.championData;
    console.log(championData);

    return <div className="champ"> <img src = {championData["Url"]} align = "middle" alt = ""/>{championData["Champion"]}: {championData["Play Count"]} Game(s) played</div>
  }
}

class ProfileData extends Component{
  render(){
    let profileData = this.props.profileData;
    console.log(profileData);
    if(profileData['leaguePoints'] == 100){
      return <div className = "profile" align = "right"> Rank: {profileData["tier"]} {profileData["rank"]} ({profileData["leagueName"]})<br/> Win/Loss: {profileData["wins"]} / {profileData["losses"]} <br/> LP: {profileData["leaguePoints"]} Series: {profileData["miniSeries"]["progress"]}</div>
    }
    else{
        return <div className = "profile" align = "right"> Rank: {profileData["tier"]} {profileData["rank"]} ({profileData["leagueName"]})<br/> Win/Loss: {profileData["wins"]} / {profileData["losses"]} <br/> LP: {profileData["leaguePoints"]}</div>
    }

  }
}


class PlayerName extends Component{
  render(){
    let playerName = this.props.playerName;
    console.log(playerName);

    return <div>{playerName["playerOrTeamName"]}</div>
  }
}


class App extends Component {
  render() {
    console.log(sortedChampData);
    console.log(myStats);

    let champDataElements = [];
    let profileDataElements = [];
    let playerNameElements = [];

    for(let i =0; i < myStats.length; i++){
      profileDataElements.push(
        <ProfileData profileData={myStats[i]}/>
      )
    }

    for(let i =0; i < myStats.length; i++){
      playerNameElements.push(
        <PlayerName playerName={myStats[i]}/>
      )
    }

    for (let i = 0; i < sortedChampData.length; i++) {
      champDataElements.push(
        <ChampData championData={sortedChampData[i]} />
      )
    }




    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"><br/><br/>{playerNameElements} Player Profile:</h1>
        </header>
        <p className="App-intro">
        </p>
        <div className = "row">
          <div className = "column">{champDataElements}</div>
          <div className = "column">{profileDataElements}</div>
        </div>
      </div>
    );
  }
}

export default App;
