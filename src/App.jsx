import './App.css'

const enemies = JSON.parse(`{"Enemies":[{"Name":"The Fox","Img":"./images/enemies/TheFox.jpg","Music":"The Fox (What Does The Fox Say_) [Official music video HD].mp3","Hp":1000,"Atk":150,"Def":100,"Level":1},{"Name":"Shibu Inu","Img":"./images/enemies/shibu.jpg","Music":"BTS (방탄소년단) 'Dynamite' Official MV.mp3","Hp":1000,"Atk":150,"Def":100,"Level":1},{"Name":"Sisters","Img":"./images/enemies/sisters.jpg","Music":"sisters.mp3","Hp":1000,"Atk":150,"Def":100,"Level":1},{"Name":"Demons","Img":"./images/enemies/demon.jpg","Music":"demon.mp3","Hp":1000,"Atk":150,"Def":100,"Level":1},{"Name":"Figurines","Img":"./images/enemies/figurines.jpg","Music":"figurines.mp3","Hp":1000,"Atk":150,"Def":100,"Level":1}]}`);
let character = {
  name: 'Bob Dap',
  image: './images/characters/mc.jpg',
  level:1,
  exp:0,
  stats: [
    { stat: 'str', value: 100 },
    { stat: 'int', value: 80 },
    { stat: 'agi', value: 60 },
    { stat: 'con', value: 50 },
    { stat: 'hp', value: 1000 },
    { stat: 'mana', value: 500 }
  ],
  actions: [
    { name: 'Attack', damage: 100 },
    { name: 'Magic Slash', damage: 200, mana: 300 },
    { name: 'Light Heal', heal: 100, mana: 200 },
    { name: 'Intermediate Heal', heal: 200, mana: 400 }
  ],
  gradeLevel: 1
};
const page = {
  tab:0,
  alertQ: [],
  alertOpen: false
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
  on:false,
  randomEnemy:null,
  audio:null
};
// window.addEventListener('DOMContentLoaded', function() {
// if (localStorage.getItem('character') !== null) {
//   character = JSON.parse(localStorage.getItem('character'));
//   newAlert("Restored Save!","#5555b9");
// }
// });
const getRandomColorLine = () => {
      const colors = ['rgba(255, 0, 0, 0.8)', 'rgba(0, 255, 0, 0.8)', 'rgba(0, 0, 255, 0.8)', 'rgba(255, 255, 0, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 255, 0.8)'];
      return colors[Math.floor(Math.random() * colors.length)];
};
const triggerSlashEffect = (thing,lines,times) => {
    const overlay = thing;
    playSound("slash.mp3");
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
    }
    if (times > 1) { 
      setTimeout(() =>{
        triggerSlashEffect(thing,lines,(times-1));
      },1000);
    }
};
const renderGame = () => {
  let randomEnemy = enemies.Enemies[Math.floor(Math.random() * enemies.Enemies.length)];
  game.randomEnemy = randomEnemy;
  document.getElementById('playerImg').src = character.image;
  document.getElementById('enemyImg').src = game.randomEnemy.Img;
  game.playerCopy = JSON.parse(JSON.stringify(character));
  game.enemyCopy = JSON.parse(JSON.stringify(game.randomEnemy));
  playEnemyMusic(game.enemyCopy.Music);
  renderActions();
};
const playEnemyMusic = (music) => {
  game.audio = new Audio("./music/enemies/"+music);
  game.audio.load();
  game.audio.play();
  game.audio.loop = true;
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
      if (game.playerCopy.actions[i].mana > game.playerCopy.stats.find(stat => stat.stat === 'mana').value) {
        button.disabled = true;
      }
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
  tab(4);
  let problem = "";
  document.getElementById('answer').focus();
  let type, num1, num2, num3, num4, plusminus, inc, multdiv;
  switch (character.gradeLevel) {
    case 0: // Kindergarten
      type = Math.floor(Math.random() * 2);
      if (type === 0) {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        plusminus = Math.floor(Math.random() * 2);
        if (plusminus === 0) {
          problem = num1 + " + " + num2 + " = ?";
          game.answer = num1 + num2;
        } else {
          if (num1 < num2) {
            problem = num2 + " - " + num1 + " = ?";
            game.answer = num2 - num1;
          } else {
            problem = num1 + " - " + num2 + " = ?";
            game.answer = num1 - num2;
          }
        }
      } else {
        num1 = Math.floor(Math.random() * 10);
        inc = Math.floor(Math.random() * 4);
        num2 = num1 + inc;
        num3 = num2 + inc;
        problem = num1 + ", " + num2 + ", " + num3 + ", ?";
        game.answer = num3 + inc;
      }
      break;

    case 1: // Grade 1
      type = Math.floor(Math.random() * 2);
      if (type === 0) {
        num1 = Math.floor(Math.random() * 20);
        num2 = Math.floor(Math.random() * 20);
        plusminus = Math.floor(Math.random() * 2);
        if (plusminus === 0) {
          problem = num1 + " + " + num2 + " = ?";
          game.answer = num1 + num2;
        } else {
          if (num1 < num2) {
            problem = num2 + " - " + num1 + " = ?";
            game.answer = num2 - num1;
          } else {
            problem = num1 + " - " + num2 + " = ?";
            game.answer = num1 - num2;
          }
        }
      } else {
        num1 = Math.floor(Math.random() * 20);
        inc = Math.floor(Math.random() * 4) + 1;
        num2 = num1 + inc;
        num3 = num2 + inc;
        problem = num1 + ", " + num2 + ", " + num3 + ", ?";
        game.answer = num3 + inc;
      }
      break;

    case 2: // Grade 2
      type = Math.floor(Math.random() * 3);
      if (type === 0) {
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
        plusminus = Math.floor(Math.random() * 2);
        if (plusminus === 0) {
          problem = num1 + " + " + num2 + " = ?";
          game.answer = num1 + num2;
        } else {
          if (num1 < num2) {
            problem = num2 + " - " + num1 + " = ?";
            game.answer = num2 - num1;
          } else {
            problem = num1 + " - " + num2 + " = ?";
            game.answer = num1 - num2;
          }
        }
      } else if (type === 1) {
        num1 = Math.floor(Math.random() * 50);
        inc = Math.floor(Math.random() * 6);
        num2 = num1 + inc;
        num3 = num2 + inc;
        problem = num1 + ", " + num2 + ", " + num3 + ", ?";
        game.answer = num3 + inc;
      } else {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        problem = num1 + " x " + num2 + " = ?";
        game.answer = num1 * num2;
      }
      break;

    case 3: // Grade 3
      type = Math.floor(Math.random() * 3);

      if (type === 0) {
        num1 = Math.floor(Math.random() * 500);
        num2 = Math.floor(Math.random() * 500);
        plusminus = Math.floor(Math.random() * 2);
        if (plusminus === 0) {
          problem = num1 + " + " + num2 + " = ?";
          game.answer = num1 + num2;
        } else {
          if (num1 < num2) {
            problem = num2 + " - " + num1 + " = ?";
            game.answer = num2 - num1;
          } else {
            problem = num1 + " - " + num2 + " = ?";
            game.answer = num1 - num2;
          }
        }
      } else if (type === 1) {
        num1 = Math.floor(Math.random() * 13);
        num2 = Math.floor(Math.random() * 13);
        problem = num1 + " x " + num2 + " = ?";
        game.answer = num1 * num2;
      } else {
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * Math.floor(Math.random() * 13);
        problem = num1 + " ÷ " + num2 + " = ?";
        game.answer = num1 / num2;
      }
      break;


    default:
      console.error("Invalid grade level");
      break;
  }

  document.getElementById('question').innerText = problem;
};

const checkAnswer = () => {
  let answer = document.getElementById('answer').value;
  if (game.answer == answer) {
    actionSuccess();
  }
  else {
    tab(9);
    document.getElementById('rightAnswer').innerText = "Answer: "+game.answer;
  }
  document.getElementById('answer').value = '';
};
const actionFailed = () => {
  if (game.playerCopy.stats.find(s => s.stat === 'hp').value - game.enemyCopy.Atk <= 0) {
    tab(5);
  }
  else {
    game.playerCopy.stats.find(s => s.stat === 'hp').value -= game.enemyCopy.Atk;
    document.getElementById('playerHp').style.width = (game.playerCopy.stats.find(s => s.stat === 'hp').value/character.stats.find(s => s.stat === 'hp').value)*100 + '%';
  }
};
const actionSuccess = () => {
  //change opacity of images based on hp
  tab(3);
  let action = character.actions.find(a => a.name === game.actionSelected);
  let manaless = true;
  if (action.mana) {
    if (game.playerCopy.stats.find(s => s.stat === 'mana').value < action.mana) {
      newAlert("Not enough mana","#d25151");
      return;
    }
    game.playerCopy.stats.find(s => s.stat === 'mana').value -= action.mana;
    manaless = false;
    document.getElementById('playerMp').style.width = (game.playerCopy.stats.find(s => s.stat === 'mana').value/character.stats.find(s => s.stat === 'mana').value)*100 + '%';
  }
  if (action.heal) { // this does not work
    game.playerCopy.stats.find(s => s.stat === 'hp').value += action.heal;
    if (game.playerCopy.stats.find(s => s.stat === 'hp').value > character.stats.find(s => s.stat === 'hp').value) {
        game.playerCopy.stats.find(s => s.stat === 'hp').value = character.stats.find(s => s.stat === 'hp').value; 
    }
    document.getElementById('playerHp').style.width = (game.playerCopy.stats.find(s => s.stat === 'hp').value/character.stats.find(s => s.stat === 'hp').value)*100 + '%';
  }
  if (action.damage) {
    triggerSlashEffect(document.getElementById('enemyBox'),10,5);
    game.enemyCopy.Hp -= action.damage;
    if (manaless && ((game.playerCopy.stats.find(s => s.stat === 'mana').value + game.playerCopy.stats.find(s => s.stat === 'int').value) <= character.stats.find(s => s.stat === 'mana').value)) {
      game.playerCopy.stats.find(s => s.stat === 'mana').value += game.playerCopy.stats.find(s => s.stat === 'int').value;
      document.getElementById('playerMp').style.width = (game.playerCopy.stats.find(s => s.stat === 'mana').value/character.stats.find(s => s.stat === 'mana').value)*100 + '%';
    }
    document.getElementById('enemyHp').style.width = (game.enemyCopy.Hp/game.randomEnemy.Hp)*100 + '%';
    if (game.enemyCopy.Hp <= 0) {
        newAlert("You Won!", "#57a857"); //replace with end screen
        const expEarned = game.randomEnemy.Level * 100;
        character.exp += expEarned;
        const getNextLevelExp = level => level * 100 + 100;
        while (character.exp >= getNextLevelExp(character.level)) {
            character.level++;
            character.exp = 0;
        }
        tab(6);
        game.audio.pause();
        game.audio = null;
        // localStorage.setItem('character', JSON.stringify(character));
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
  document.querySelector(':root').style.setProperty('--bg', "url(/mathdungeon/images/bgs/"+bg+") no-repeat fixed center center");
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
const selectGrade = () => {
  const levels = [0,1,2,3];
  const gradelevel = parseInt(document.getElementById('grade').value);
  if (levels.includes(gradelevel)) {
    character.gradeLevel = gradelevel;
    newAlert("Saved!","#57a857");
  }
  else {
    newAlert("Error","#d25151");
  }
};
const alert10 = () => {
  if (!page.alertOpen) {
    page.alertOpen = true;
    document.getElementById("snackbar").innerHTML = page.alertQ[0][0];
    if (page.alertQ[0][1]) {
      document.getElementById("snackbar").style.backgroundColor = page.alertQ[0][1];
    }
    let x = document.getElementById("snackbar");
    x.className = "showed";
    setTimeout(() => {
      page.alertQ.splice(0,1);
      page.alertOpen = false;
      if (page.alertQ.length > 0) {
        alert10();
      }
      else {
        x.className = x.className.replace("showed", "");
      }
    }, 3000);
  }
};
const newAlert = (message, color) => {
  page.alertQ.push([message, color]);
  alert10();
};
const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAnswer();
  }
};
export default function App() {
  return (
    <main>
     <div className='bg'></div>
      <div id="snackbar"></div>
      <div className='tab show'>
        <h1>Select</h1>
        <div className='selectionMenu'>
          <div onClick={() => tab(3)}>Battle</div><div onClick={() => tab(2)}>Character</div><div onClick={() => tab(1)}>Settings</div>
        </div>
      </div>
      <div className='tab'>
        <h1>Settings</h1>
        <h4>0(kindergarten) - 3(grade)</h4>
        <h4>Default is 1st grade</h4>
        <div className='settings'>
          <div className='inputAnswer'>
            <input placeholder='Grade Level' type='text' id='grade' />
            <button onClick={() => selectGrade()}>Save</button>
          </div>
          <button onClick={() => tab(0)} className='backBtn'>Back</button>
        </div>
      </div>
      <div className='tab'>
        <div className='character'>
          <div>
            <div id='chName'></div>
            <div id='chMains'><div id='chLvl'></div><div id='chExp'></div></div>
            <div id='chStats'></div>
          </div>
          <div>
            <img id='chImg' />
          </div>
        </div>
        <button onClick={() => tab(0)} className='backBtn'>Back</button>
      </div>
      <div className='tab'>
        <div className='gameSpace'>
          <div className='player' id='playerBox'>
            <img id='playerImg' />
            <div className='mpBar'><div id='playerMp'></div></div>
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
        <h1>Question</h1>
        <div className='question'>
          <div id='question'></div>
          <div className='inputAnswer'>
            <input type='text' id='answer' placeholder='Type answer here...' onKeyDown={handleKeyPress} />
            <button onClick={() => checkAnswer()}>Submit</button></div>
        </div>
      </div>
      <div className='tab'>
        <h1>Game Over, You Died :(</h1>
        {/* Back to Home btn dark red background*/}
      </div>
      <div className='tab'>
        <h1>Victory</h1>
        <button onClick={() => tab(0)} className='backBtn'>Back</button>
        {/* Character level and exp bar and next boss btn and home btn */}
      </div>
      <div className='tab'>
        {/* Loading new game */}
      </div>
      <div className='tab'>
        {/* unlocked levels menu */}
      </div>
      <div className='tab'>
        <div className='wrong' onClick={() => {actionFailed();tab(3);}}>
          <h1>Incorrect</h1>
          <div className="line-container">
              <div className="line"></div>
              <span className="line-text" id='rightAnswer'></span>
              <div className="line"></div>
          </div>
          <br/>
          Click anywhere to continue
          </div>
      </div>
    </main>
  )
}

