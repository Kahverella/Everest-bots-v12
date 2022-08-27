const { Schema, model } = require("mongoose");

const RLSchema = Schema({
    Id: { type: String, default: null },
    Logs: { type: Array, default: [] }
  });

const RLModel = model('rolelog', RLSchema);