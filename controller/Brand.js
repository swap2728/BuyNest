const {Brand} = require('../model/Brand')
exports.fetchBrands = async (req, res)=>{
    try{ 
        // console
        const brands = await Brand.find({}).exec();
        // console.log(brands)
        res.status(200).json(brands)
    }
    catch(err){
        res.status(400).json(err);
    }
};

exports.createBrand = async (req , res)=>{
    
    try{
        const brand = new Brand(req.body)
        const response = await brand.save();
        console.log('done')
        res.status(201).json(response);
    }
    catch(err){
        res.status(400).json(err);
    }

}