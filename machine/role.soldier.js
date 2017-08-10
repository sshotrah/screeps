var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.pos != Game.flags.Flag1.pos ){
            creep.moveTo(Game.flags.Flag1);
        }
    }
};

module.exports = roleUpgrader;