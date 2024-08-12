import './App.css'

const enemies = {
  level1:`{"Name":"The Fox","Img":"./images/enemies/TheFox.jpg","Music":"The Fox (What Does The Fox Say_) [Official music video HD].mp3","Hp":1000,"Atk":150,"Def":100,"Level":1}`
};
const character = {
  name: 'Alice',
  image: './images/characters/mc.jpg',
  level:1,
  exp:0,
  stats: [
    { stat: 'str', value: 100 },
    { stat: 'int', value: 80 },
    { stat: 'agi', value: 60 },
    { stat: 'con', value: 50 },
    { stat: 'hp', value: 1000 },
    { stat: 'mana', value: 50 }
  ],
  actions: [
    { name: 'Attack', damage: 100 },
    { name: 'Heal', heal: 100, mana: 20 },
    { name: 'Magic', damage: 200, mana: 30 }
  ],
  gradeLevel: 1
};
const page = {
  tab:0
};
const game = {
  playerCopy:null,
  enemyCopy:null,
  actionSelected:'Attack',
  turn:0,
  playerTurn:true,
  answer:null,
  correct:[],
  incorrect:[],
  on:false
};
const getRandomColorLine = () => {
      const colors = ['rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.8)', 'rgba(0, 0, 255, 0.8)', 'rgba(255, 255, 0, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 255, 0.8)'];
      return colors[Math.floor(Math.random() * colors.length)];
};
const triggerSlashEffect = (thing,lines,times) => {
    const overlay = thing;

    for (let i = 0; i < lines; i++) {
        const slash = document.createElement('div');
        slash.classList.add('slash');

        const color = getRandomColorLine();
        const svg = `
            <svg viewBox="0 0 100 2" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="100" y2="1" stroke="${color}" stroke-width="2" />
            </svg>`;

        slash.innerHTML = svg;

        const rotation = Math.random() * 90 - 45;
        slash.style.transform = `rotate(${rotation}deg)`;

        const startY = Math.random() * window.innerHeight;

        slash.style.top = `${startY}px`;
        slash.style.opacity = '1';

        overlay.appendChild(slash);
        

        setTimeout(() => {
            slash.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            slash.remove();
        }, 750);
        playSound("slash.mp3");
    }
    if (times > 1) { 
      setTimeout(() =>{
        triggerSlashEffect(thing,lines,(times-1));
      },1000);
    }
};
const renderGame = () => {
  document.getElementById('playerImg').src = character.image;
  document.getElementById('enemyImg').src = JSON.parse(enemies.level1).Img;
  game.playerCopy = character;
  game.enemyCopy = JSON.parse(enemies.level1);
  playEnemyMusic(game.enemyCopy.Music);
  renderActions();
};
const playEnemyMusic = (music) => {
  const audio = new Audio("./music/enemies/"+music);
  audio.load();
  audio.play();
  audio.loop = true;
};
const playSound = (sound) => {
  const audio = new Audio("./sounds/"+sound);
  audio.load();
  audio.play();
};
const renderActions = () => {
  document.getElementById('actionsList').innerHTML = '';
  for (let i = 0; i < character.actions.length; i++) {
    let button = document.createElement('button');
    button.innerText = character.actions[i].name;
    if (game.actionSelected === character.actions[i].name) {
      button.classList.add('selected');
    }
    if (character.actions[i].mana) {
      button.dataset.mana = character.actions[i].mana;
    }
    button.addEventListener('click', () => {
      game.actionSelected = character.actions[i].name;
      renderActions();
    });
    document.getElementById('actionsList').appendChild(button);
  }
};
const useAction = () => {
  //change opacity of images based on hp
  tab(4);
  let problem = "";
  document.getElementById('answer').focus();
  switch (character.gradeLevel) {
    case 1:
      let type = Math.floor(Math.random() * 2);
      if (type === 0) {
        let num1 = Math.floor(Math.random() * 50);
        let num2 = Math.floor(Math.random() * 50);
        let plusminus = Math.floor(Math.random() * 2);
        if (plusminus === 0) {
          problem = num1+" + "+num2+" = ?";
          game.answer = num1 + num2;
        }
        else {
          if (num1 < num2) {
            problem = num2+" - "+num1+" = ?";
            game.answer = num2 - num1;
          }
          else {
            problem = num1+" - "+num2+" = ?";
            game.answer = num1 - num2;
          }
        }
      }
      else {
        let num1 = Math.floor(Math.random() * 50);
        let inc = Math.floor(Math.random() * 6);
        let num2 = num1+inc;
        let num3 = num2+inc;
        problem = num1+", "+num2+", "+num3+", ?";
        game.answer = num3+inc;
      }
      break;
  };
  document.getElementById('question').innerText = problem;
};
const checkAnswer = () => {
  let answer = document.getElementById('answer').value;
  if (game.answer == answer) {
    actionSuccess();
  }
  else {
    actionFailed();
    tab(3);
  }
  document.getElementById('answer').value = '';
};
const actionFailed = () => {
  game.playerCopy.stats[4].value -= game.enemyCopy.Atk;
  document.getElementById('enemyHp').style.width = (game.playerCopy.stats[4].value/character.stats[4].value)*100 + '%';
};
const actionSuccess = () => {
  //change opacity of images based on hp
  tab(3);
  let action = character.actions.find(a => a.name === game.actionSelected);
  if (action.mana) {
    if (character.stats.find(s => s.stat === 'mana').value < action.mana) {
      alert('Not enough mana');
      return;
    }
    character.stats.find(s => s.stat === 'mana').value -= action.mana;
  }
  if (action.heal) { // this does not work
    character.stats.find(s => s.stat === 'hp').value += action.heal;
    if (character.stats.find(s => s.stat === 'hp').value > character.stats.find(s => s.stat === 'hp').max) {
      character.stats.find(s => s.stat === 'hp').value = character.stats.find(s => s.stat === 'hp').max;
    }
  }
  if (action.damage) {
    triggerSlashEffect(document.getElementById('enemyBox'),1,5);
    game.enemyCopy.Hp -= action.damage;
    document.getElementById('enemyHp').style.width = (game.enemyCopy.Hp/JSON.parse(enemies.level1).Hp)*100 + '%';
    if (game.enemyCopy.Hp <= 0) {
      alert('You won!');
      character.exp += enemy.Level * 100;
      character.level++;
      tab(0);
      return;
    }
  }
  game.turn++;
  game.playerTurn = !game.playerTurn;
}
const renderCharacter = () => {
  document.getElementById('chName').textContent = character.name;
  document.getElementById('chLvl').textContent = "Level "+character.level;
  document.getElementById('chExp').textContent = "Exp "+character.exp;
  document.getElementById('chImg').src = character.image;
  let stats = document.getElementById('chStats');
  stats.innerHTML = '';
  for (let i = 0; i < character.stats.length; i++) {
    let stat = document.createElement('div');
    stat.className = 'stat';
    let type = document.createElement('div');
    type.className = 'statType';
    type.textContent = character.stats[i].stat;
    let value = document.createElement('div');
    value.className = 'statValue';
    value.textContent = character.stats[i].value;
    stat.appendChild(type);
    stat.appendChild(value);
    stats.appendChild(stat);
  }
};
const changeBg = function(bg) {
  document.querySelector(':root').style.setProperty('--bg', "url(./images/bgs/"+bg+") no-repeat fixed center center");
};
const tab = function(tab2) {
  const classes = document.getElementsByClassName("tab");
  const shown = document.getElementsByClassName("show");
  shown[0].classList.remove("show");
  classes[tab2].classList.add("show");
  page.tab = tab2;
  switch (tab2) {
    case 0:
      changeBg("woods.jpg");
      break;
    case 3:
      changeBg("maple.jpg");
      if (!game.on) {
        renderGame();
        game.on = true;
      }
      break;
    case 2:
      renderCharacter();
      break;
  };
};
// document.getElementById('answer').addEventListener
export default function App() {
  return (
    <main>
     <div className='bg'></div>
      <div className='tab show'>
        <div className='selectionMenu'>
          <btn onClick={() => tab(3)}>Battle</btn><btn onClick={() => tab(2)}>Character</btn><btn onClick={() => tab(1)}>Settings</btn>
        </div>
      </div>
      <div className='tab'>
        
      </div>
      <div className='tab'>
        <div className='character' onClick={() => tab(0)}>
          <div>
            <div id='chName'></div>
            <div id='chMains'><div id='chLvl'></div><div id='chExp'></div></div>
            <div id='chStats'></div>
          </div>
          <div>
            <img id='chImg' />
          </div>
        </div>
      </div>
      <div className='tab'>
        <div className='gameSpace'>
          <div className='player' id='playerBox'>
            <img id='playerImg' />
            <div className='hpBar'><div id='playerHp'></div></div>
          </div>
          <div className='actions'>
            <div id='actionsList'></div>
            <button id='use' onClick={() => useAction()}>Use</button>
          </div>
          <div className='enemy' id='enemyBox'>
            <img id='enemyImg' />
            <div className='hpBar'><div id='enemyHp'></div></div>
          </div>
        </div>
      </div>
      <div className='tab'>
        <div className='question'>
          <h1>Question</h1>
          <div id='question'></div>
          <div className='inputAnswer'><input type='text' id='answer' placeholder='Type answer here...'/><button onClick={() => checkAnswer()}>Submit</button></div>
        </div>
      </div>
    </main>
  )
}
