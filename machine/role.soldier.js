var roleSoldier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var listFlag = creep.room.find(FIND_FLAGS);
       
        
        if(creep.memory.action == null){
            
            creep.memory.action = listFlag[0].name;
           
        }else{
            const flagMem = Game.flags[creep.memory.action];
          
            for(var i = 0; i < listFlag.length; i++){
                
                if(!creep.pos.isEqualTo(flagMem.pos)){
                    creep.moveTo(flagMem);
                }else{
                   
                    if(flagMem.name == listFlag[i].name){
                        
                        var n = (i < (listFlag.length - 1))? i+1: 0;
                        
                        creep.memory.action = listFlag[n].name;
                    }
                }
             
            }
        }
    }
};

module.exports = roleSoldier;