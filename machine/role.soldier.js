var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var flags = Game.flags;
        if(!creep.memory.action){
            creep.memory.action = flags[0];
        }
        for(var i = 0; i < flags.length; i++){
            if(creep.pos != creep.memory.action.pos ){
                creep.moveTo(creep.memory.action);
            }else{
                if(creep.memory.action == flags[i]){
                    var n = (i < flags.length)? i+1: 0;
                    creep.memory.action = flags[n];
                }
            }
        }
    }
};

module.exports = roleUpgrader;