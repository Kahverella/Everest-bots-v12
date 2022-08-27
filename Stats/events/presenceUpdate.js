const lastSeenDB = require("../models/lastseen")

module.exports = async (oldUser, newUser) => {
if (newUser.user.bot) return;

const User = newUser.user.presence.status;

// if (User === "online" || User === "idle" || User === "dnd") {
//     lastSeenDB.updateOne({ userID: newUser.user.id }, { $inc: { JoinTime: Date.now() } }, { upsert: true }).exec();
// } else if (User === 'offline') {
//     lastSeenDB.updateOne({ userID: newUser.user.id }, { $inc: { LeaveTime: Date.now() } }, { upsert: true }).exec();
// }

};