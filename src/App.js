import React, {Component} from 'react'
import './App.css'
import {Board} from 'react-trello'

//inject the magically colonyJS
const createColony = require('./create_colony');
const createTask = require('./create_task');
const createRating = require('./create_rating');

const data = require('./data.json')

const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

var uName = '';




const handleDragStart = (cardId, laneId) => {
    console.log('drag started')
    console.log(`cardId: ${cardId}`)
    console.log(`laneId: ${laneId}`)
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    console.log('drag ended')
    console.log(`cardId: ${cardId}`)
    console.log(`sourceLaneId: ${sourceLaneId}`)
    console.log(`targetLaneId: ${targetLaneId}`)

    //check user role parent to set create rating
    if(targetLaneId == "REPEAT"){
      console.log("submit rating to approve for payment")
      //do parent approved = rating 5 to approve allowance for this task
        console.log("user name via uport"+uName)
      if(uName.includes('Kirk')){
        //is parent
        console.log('is parent -- trigger create rating to approve allowance payment')
        createColony()
          .then(createRating)
          // We're exiting hard here as the providers keep polling otherwise
          .then(() => process.exit())
          .catch(err => console.error(err));
      }


    }
}

class App extends Component {
    state = {boardData: {lanes: []}}

    setEventBus = eventBus => {
        this.setState({eventBus})
    }

    async componentWillMount() {
        const response = await this.getBoard()
        this.setState({boardData: response})
    }

    getBoard() {
        return new Promise(resolve => {
            resolve(data)
        })


    }

    completeCard = () => {

console.log("uport signin")


const mnidAddress = '2oyY8Ui6CdgqHVi7ZbtXQXhhuqjByq9uhzx';
const signingKey = '4d2ba1dfa70607017c5c94f8318e781254ecf5a6d315caa63d99486dd07dc208';
const appName = 'ColonyAuth';


     const uriHandler = (uri) => {
       //window.open(uri);
       window.open(uri, "_blank", "toolbar=yes,scrollbars=no,resizable=no,top=500,left=500,width=400,height=400");
      //qrcode.generate(uri, {small: true})

       console.log(uri)
     }

     const uport = new uportConnect.Connect(appName, {uriHandler,
         clientId: mnidAddress,
         network: 'rinkeby',
         signer: uportConnect.SimpleSigner(signingKey)
     });

     // Request credentials
     uport.requestCredentials({
       requested: ['name', 'avatar'],
     }).then((credentials) => {
       console.log('creds:'+credentials);
       console.log(credentials.name);
        console.log(credentials.avatar.uri);
        uName = credentials.name;
        document.getElementById('uPortal').innerHTML = '<img height=55 width=55 src='+credentials.avatar.uri+' /> <br>Hi,'+credentials.name;

     })
    }

    addCard = () => {
        this.state.eventBus.publish({
            type: 'ADD_CARD',
            laneId: 'BLOCKED',
            card: {id: 'Ec2Error', title: 'EC2 Instance Down', label: '30 mins', description: 'Main EC2 instance down'}
        })
    }

    shouldReceiveNewData = nextData => {
        console.log('New card has been added')
        console.log(nextData)
    }

	handleCardAdd = (card, laneId) => {
    console.log('Create task')
		console.log(`New card added to lane ${laneId}`)
		console.dir(card.title)
    console.dir(card.description)
    console.dir(card.id)
 //set the data
 createColony()
   .then(createTask)
   // We're exiting hard here as the providers keep polling otherwise
   .then(() => process.exit())
   .catch(err => console.error(err));

	}


    render() {
        return (
            <div className="App">

                <div className="App-header">
                    <h3>Chores on the Blockchain</h3>

                </div>
                <div className="App-intro">
                <div id="uPortal"><button id="uportBtn" onClick={this.completeCard} style={{margin: 5}}>
                      Uport Signin
                  </button>
                  </div>
                    <Board
                        editable
												onCardAdd={this.handleCardAdd}
                        data={this.state.boardData}
                        draggable
                        onDataChange={this.shouldReceiveNewData}
                        eventBusHandle={this.setEventBus}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                    />

                </div>
            </div>
        )
    }
}

export default App
