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
   
    
    var hasOneUpgrader = Game.rooms[roomName].find(FIND_MY_CREEPS, {
                filter: (creep) => creep.memory.role == 'upgrader'
            });
    var listOisif = Game.rooms[roomName].find(FIND_MY_CREEPS, {
                filter: (creep) => creep.memory.role == 'oisif'
            });
    
    /*
    
    listOisif.forEach(function(creep){
        var structureFull = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
        });
        if( structureFull.length = 0){
            creep.memory.role = 'upgrader';
        }else{
            
            creep.memory.role = 'harvester';
        }
      
    });*/
    
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
    /// Si, en allouant la moitiÃ©, on a plus que ce qu'il faut pour crÃ©er le plus gros monstre, on crÃ©Ã© un creep
    /// On check le pourcentage de soldat, si on est en dessous de (niveau de la room*15)%/75% (le pourcentage max est juste de 75%, le min est de 15%)
    /// Si en dessous on produit un soldat, de nouveau calcul pour savoir de quel type
    /// sinon, on produit un oisif
    
    /// On détermine des quotas en fonction du niveau de controller
   
    var levelController =  Game.rooms[roomName].controller.level;
    var totalUnit = levelController * (levelController + 9);
    var quotaArmy = levelController*10/100;
    
    var totalArmy = quotaArmy*totalUnit;
    var totalUpgrader = levelController;
    var totalOisif = totalUnit - totalArmy - totalUpgrader;
    var totalBuilder = 0;
    var quotaBuilder = 5/100;
    var hasconstructionsite = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
    if(hasconstructionsite.length > 0){
        var builderMax = (quotaBuilder*totalOisif < 1)? 1 : quotaBuilder*totalOisif;
        totalBuilder = (hasconstructionsite.length > builderMax)? builderMax : hasconstructionsite.length;
    }
    var totalHarvester = totalOisif - totalBuilder;
    
  
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var army = _.filter(Game.creeps, (creep) => creep.memory.role == 'army');
    var spawningtext = '';
    var file = 0;
    while(file == 0){
        if(harvesters.length < totalHarvester){
            if(Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE],undefined) == OK){
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
                spawningtext = '\uD83D\uDE48' + ' Spawn d\'un nouveau Harvester: ' + newName;
                break;
            }
        }
        if(builders.length < totalBuilder){
            if(Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE],undefined) == OK){
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
                spawningtext = '\uD83D\uDE48' + ' Spawn d\'un nouveau Builder: ' + newName;
                break;
            }
        }
        if(upgraders.length < totalUpgrader){
            if(Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE],undefined) == OK){
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
                spawningtext = '\uD83D\uDE48' + ' Spawn d\'un nouveau Upgrader: ' + newName;
                break;
            }
        }
        if(army.length < totalArmy){
            if(Game.spawns['Spawn1'].canCreateCreep([ATTACK,TOUGH,MOVE],undefined) == OK){
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'soldier'});
                spawningtext = '\uD83D\uDE48' + ' Spawn d\'un nouveau Soldat: ' + newName;
                break;
            }
        }
        file = -1;
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningtext + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
}

function attackMode(){
    /// a dÃ©velopper
    
}

function cleaning(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
}