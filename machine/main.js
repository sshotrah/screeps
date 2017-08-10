//Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE], 'Harvester1' );

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    for(var roomName in Game.rooms ){
        defenseMode(roomName);
        constructMode(roomName);
        farmingMode(roomName);
        spawningMode(roomName);
        cleaning();
    }
   

  
    
   
    
   
}
function defenseMode(roomName){
    //// Check if we have invaders
    /// if we have, engage defender
    ///engage tower
    ///defend
    console.log(roomName);
    var hostile = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostile.length > 0){
        var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_TOWER}
        });
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
     
    Game.rooms[roomName].visual.text(
            '\uD83D\uDE48' ,1,1);
}

function constructMode(roomName){
    //// Check controller level
    //// Check How many extension we have
    //// Engage one builder if needed
    //// Repair if something need to be repaired
     for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
        var closestDamagedStructure = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
        if(closestDamagedStructure.length > 0) {
           var closestBuilder = closestDamagedStructure.pos.findClosestByRange(FIND_CREEPS, {
                filter: (creep) => creep.memory.role == 'builder'
            });
            closestBuilder.repair(closestDamagedStructure);
        }
    
}
function farmingMode(roomName){
   //// Check Controller level
   //// Engage at least one creep to upgrade it
   //// Check Energy level on Every Structure
   //// If not full, engage harvester
   //// if full, engage upgrader
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
       
    } 
}

function spawningMode(roomName){
    /// Check le nombre de ressource restante de la room. 
    /// Si, en allouant la moitié, on a plus que ce qu'il faut pour créer le plus gros monstre, on créé un creep
    /// On check le pourcentage de soldat, si on est en dessous de (niveau de la room*15)%/75% (le pourcentage max est juste de 75%, le min est de 15%)
    /// Si en dessous on produit un soldat, de nouveau calcul pour savoir de quel type
    /// sinon, on produit un oisif
    
    
   
            
            //_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var sources = Game.rooms[roomName].find(FIND_SOURCES);
    if(sources[0].energyCapacity / sources[0].energy < 2) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'oisif'});
        console.log('Spawning new oisif: ' + newName);
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '\uD83D\uDE48' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
}

function attackMode(){
    /// a développer
    
}

function cleaning(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
}