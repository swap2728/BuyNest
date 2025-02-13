const mongoose = require('mongoose')
const {Schema} = mongoose


// "value": "smartphones",
// "label": "smartphones",
// "checked": false,
// "id": "bccc"

const BrandSchema = new Schema({
    label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },

})

const virtual = BrandSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

BrandSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){ delete ret.id }
})
exports.Brand = mongoose.model('Brand',BrandSchema);