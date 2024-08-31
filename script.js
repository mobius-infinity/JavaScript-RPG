let xp = 0;
let health = 100;
let gold = 80;
let maxHealth = 100;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"]; //"dagger", "sword"

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText")
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = 
[
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 20  
    },
    {
        name: "sword",
        power: 50
    }
];
const monster = [
    {
        name: "slime",
        health: 25,
        atk: 8
    },
    {
        name: "fanged beast",
        health: 90,
        atk: 15
    },
    {
        name: "small dragon",
        health: 300,
        atk: 50
    }
]
const locations = 
[
    {
        name: "town square",
        "button text": ["Go to store", "Go to Cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\"."
    },
    {
        name:"store",
        "button text": ["Buy 10 health (10 gold)","Buy weapon (50 gold)","Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store.",
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, goTown],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REILAY?"],
        "button functions": [restart, restart, restart],
        text: "You die."
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME!"
    },
    {
        name: "Secret Ending",
        "button text": ["REPLAY?", "REPLAY?", "REILAY?"],
        "button functions": [restart, restart, restart],
        text: "You Win! but what cost . . . \n (You are dead)"
    }
];
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

healthText.innerText = health;
goldText.innerText = gold;
function update(locations) //update player's location
{
    console.log("Updating location...")
    button1.innerText = locations["button text"][0];
    button2.innerText = locations["button text"][1];
    button3.innerText = locations["button text"][2];
    button1.onclick = locations["button functions"][0];
    button2.onclick = locations["button functions"][1];
    button3.onclick = locations["button functions"][2];
    text.innerText = locations.text;
}
function goStore() 
{
    console.log("Going to Store");
    update(locations[1]);
}
function goTown() 
{
    monsterStats.style.display = "none";
    console.log("Go To Town");
    update(locations[0]);
}
function buyHealth() 
{
    console.log("Buy Health");
    if(gold >= 10 && health < maxHealth)
    {
        gold -=10;
        health +=10;
        if(health > maxHealth) health = maxHealth;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else if(gold < 10)
    {
        text.innerText = "You don't have enough gold to buy health.";
    }
    else if(health >= 100)
    {
        text.innerText = "Your health is full.";
    }
}
function buyWeapon() 
{
    console.log("Buy Weapon");
    if(gold < 50)
    {
        text.innerText = "Your gold is not enough, you can't buy a new weapon.";
        return;
    }
    else if(currentWeapon >= weapons.length - 1)
    {
        text.innerText = "You bought the newest weapon.";
        return;
    }
    gold-=50;
    currentWeapon++;
    goldText.innerText = gold;
    let newWeapon = weapons[currentWeapon].name;
    text.innerText = "You have a new weapon, a " + newWeapon +'!';
    inventory.push(newWeapon);
}
function goCave() 
{
    console.log("Going to Cave");
    update(locations[2])
} 
function fightSlime()
{
    console.log("Start fighting Slime");
    fighting = 0; //maybe I will change it to find monster name to index
    goFight();    //instead of indexing directly by number
}
function fightBeast()
{
    console.log("Start fighting Beast");
    fighting = 1;
    goFight();
}
function fightDragon() 
{
    console.log("Start fighting Dragon");
    fighting = 2;
    goFight();
}
function goFight()
{
    console.log("Go Fighting");
    update(locations[3]);
    monsterStats.style.display = "block";
    monsterHealth = monster[fighting].health;
    monsterHealthText.innerText = monsterHealth;
    monsterNameText.innerText = monster[fighting].name;
}

function attack()
{
    text.innerText = "You attacked the " + monster[fighting].name + " with " + weapons[currentWeapon].name + ".\n";
    text.innerText += "The " + monster[fighting].name + " fights back.";   
    health -= monster[fighting].atk;
    monsterHealth -= weapons[currentWeapon].power + Math.floor((Math.random()+0.6) * xp*0.25);
    if(health <= 0 && monsterHealth <=0)
    {
        healthText.innerText = 0;
        monsterHealthText.innerText = 0;
        secretEnding();
        return;
    }
    if(health <= 0)
    {
        healthText.innerText = 0;
        monsterHealthText.innerText = monsterHealth;
        lose();
        return;
    }
    else if(monsterHealth <=0) //although I don't need the else conditionn but it is more readable!
    {
        healthText.innerText = health;
        monsterHealthText.innerText = 0;
        if(monster[fighting].name.match("small dragon"))
        {
            winGame();
            return;
        }
        else
        {
            defeatMonster();
            return;
        }
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

}

function dodge()
{
    var chanceOfdodge = Math.floor(Math.random()*2);
    text.innerText = "You dodged the " + monster[fighting].name;
    if(chanceOfdodge >= 1)
    text.innerText += " successfully."; 
    else
    {
        text.innerText += "\nbut failed..."; 
        health -= monster[fighting].atk;
        if(health<=0)
        {
            healthText.innerText = 0;
            lose();
            return;
        }
        healthText.innerText = health;
    }
}

function defeatMonster()
{
        gold += Math.floor((monster[fighting].atk + monster[fighting].health) * 1.2);
        xp += Math.floor((monster[fighting].atk + monster[fighting].health)/4);
        goldText. innerText = gold;
        xpText. innerText = xp;
        update(locations[4]);
}
function  winGame()
{
    update(locations[6]);
}
function lose()
{
    update(locations[5]);
}
function secretEnding()
{
    update(locations[7]);
}
function restart()
{
    xp = 0;
    health = 100;
    gold = 100;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    health[text.innerText] = health;
    xpText.innerText = xp;
    healthText.innerText = health;
    xpText.innerText = xp;
    gold.innerText = gold;
    goTown();
}