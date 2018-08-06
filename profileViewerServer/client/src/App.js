import React,  {Component}  from 'react';
import './App.css';
import "./style.css";
import axios from "axios";
import ReactDOM from 'react-dom'; 
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


// ReactDOM.render((
//   <Router>
//     <App/>
//   </Router>
// ), document.getElementById('root'))

class ChampData extends Component {
  render() {
    let championData = this.props.championData;
    return <div className="champ"> <img className= "champPic" src = {championData["Url"]} align = "middle" alt = ""/>{championData["Champion"]}: {championData["Play Count"]} Game(s) played</div>
  }
}

class ProfileData extends Component{
  render(){
    let profileData = this.props.profileData;
    // console.log(profileData);
    if(profileData['leaguePoints'] === 100){
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
    // console.log(playerName);

    return <div>{playerName["playerOrTeamName"]}</div>
  }
}

class ChampMastery extends Component{
  render() {
    let champMastery = this.props.champMastery;
    // console.log(champMastery);
    return <div className = "mastery"> <img className= "champPic" src = {champMastery["Url"]} align = "middle" alt = ""/> {champMastery["Champion"] + " "} 
     mastery level: {champMastery["Mastery Level"] +"\n"}{"\n"}</div>
  }
}

class GamesData extends Component{
  render(){
    let gamesData = this.props.gamesData;
    return <div className = "gamesPlayed"> All Games Played Today: {Object.keys(gamesData)[0] + ": " + gamesData[Object.keys(gamesData)[0]]} </div>
    //FIX THIS
    // {
  }
}



class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      response: ''
    }
  }

  componentDidMount() {
    axios.get("http://localhost:3000/playcount").then((res) => {
      this.setState({
        playCount: res
      });

    });
    axios.get("http://localhost:3000/myprofile").then((res) =>{
      this.setState({
        profile: res
      });
    });

    axios.get("http://localhost:3000/mastery").then((res) =>{
      this.setState({
        mastery: res
      });
    });

    axios.get("http://localhost:3000/gamesPlayedToday").then((res) =>{
      this.setState({
        gamesPlayed: res
      });
    });
    // this.callApi()
    //   .then(res => this.setState({ response: res.express }))
    //   .catch(err => console.log(err));
  }


  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    // console.log(myStats);
    // console.log(myMastery)
    let champDataElements = [];
    let profileDataElements = [];
    let playerNameElements = [];
    let masteryLevelElements = []
    let gamesPlayedElements = []

    if (this.state.gamesPlayed !== undefined){
      for(let i = 0; i < Object.values(this.state.gamesPlayed)[0].length; i++){
        console.log(Object.keys(Object.values(this.state.gamesPlayed)[0][i])[0])
        gamesPlayedElements.push(
          <GamesData gamesData ={Object.values(this.state.gamesPlayed)[0][i]}/>
          )
      }
    }

    if (this.state.playCount !== undefined){
      for(let i = 0; i < Object.values(this.state.playCount)[0].length; i++) {
        champDataElements.push(
        <ChampData championData={(Object.values(this.state.playCount)[0][i])} />
        )
      }
    }
      
    
    
    if(this.state.mastery !== undefined){
      for(let i = 0; i< Object.values(this.state.mastery)[0].length; i++){
        masteryLevelElements.push(
          <ChampMastery champMastery ={Object.values(this.state.mastery)[0][i]}/>
        )
      }
    }
    

    if(this.state.profile !== undefined){
      for(let i =0; i < Object.values(this.state.profile)[0].length; i++){
        // profileDataElements.push(
        //   <ProfileData profileData={Object.values(this.state.playCount)[0][i]}/>
        // )
      } 
    }

    return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            <img className = "playerImage" src = "https://www.gosugamers.net/starcraft2/images/2012/december/418664_10152074743260556_1850047853_n.jpg" />
            <br/>{playerNameElements} Player Profile:
          </h1>
        </header>
        <p className="App-intro">
        {this.state.response}
        </p>
        <div className = "row">
          <div className = "column">
          	{/*<Route exact path ='/' component = {champDataElements} />*/}
          	{champDataElements}
          </div>
          <div className = "column">
          	{/*<Route exact path = '/' component = {profileDataElements} />*/}
          	{gamesPlayedElements}
          	{profileDataElements}
          </div>
          <div className = "column">
          	{/*<Route exact path = '/' component = {masteryLevelElements} />*/}
          	{masteryLevelElements}
          </div>
        </div>
        <div className = "row">
          <div className = "column"></div>
          <div className = "column">
          	{/*<Route path = '/gamesPlayed' component = {gamesPlayedElements} />*/}

          </div>
          <div className = "column"></div>
        </div>
      </div>
     </Router>
    );
  }
}

// export ChampMastery;
// export PlayerName;
// export ProfileData;
// export GamesData;
// export ChampData;
export default App;
