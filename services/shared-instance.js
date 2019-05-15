var shared_instance = {
    'offset' : {},

    isCalibrated : function () {
        return this.cloudObject != undefined;
    },

    checkSecret: function(secret) {
        if (!this.isCalibrated()) {
            return false;
        } 

        return this.cloudObject.secret == secret;
    }
};
module.exports = shared_instance;