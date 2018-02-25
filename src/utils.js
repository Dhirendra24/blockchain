module.exports.waitSync = function (time) {
    const currentTime = new Date();
    while (new Date() - currentTime < time) {}
};
