import dbConnect from '../../server/utils/dbConnect';
const loadProducts = async(params={})=>{
	try{
		console.log('loadProducts~~~');
		let conn = await dbConnect();
		const products  = await conn.collection('products').find(params).toArray();
		return products;
	}catch(err){
		console.log('loadProducts err', err);
	}
};
module.exports = loadProducts;
export default loadProducts;