const {Schema, model} = require('mongoose');


const sellerCustomerSchema = new Schema({
     myId:{
        type: String,
        required: true
     },
     myFriendsId: {
        type: Array,
        default: []
     }
}, {timestamps: true});

module.exports = model('seller_customer', sellerCustomerSchema);