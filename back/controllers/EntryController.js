const KapraModel = require('../database/KapraModel.js')
const relationModel = require('../database/relationModel.js');
const HistoryModel = require('../database/HistoryModel.js')

const kapreEntry = async (req, res) => {
  const { name,  rate, than, meter, supplier,purchaserate } = req.body;

  const kapraEntry = await KapraModel.create({
    name,
    rate,
    than,
    meter,
    supplier,purchaserate
  });


  await HistoryModel.create({name,than,meter,rate,purchaserate,stock:'StockIn',billno:1,total:meter*rate,relation:'Supplier',personname:supplier})
  
  res.json(kapraEntry);
};

    const relationEntry = async (req, res) => {
      const { name, address, phone, relation } = req.body;

      const done = await relationModel.create({
        name,
        address,
        phone,
        relation,
      });

      res.json(done);
    };
    
    const HistoryEntry = async(req,res)=>{
        const {name,than,meter,rate,total,billno,relation,personname} = req.body

        try {
            const checkIfExisist = await KapraModel.find({ name });

            if (checkIfExisist.length === 0) {
              return res.status(404).json("This kapra doesn't exist");
            }
            const entry =await HistoryModel.create({
                name,than,meter,rate,total,billno,stock,relation,personname
            })
            res.json(entry)
        } catch (error) {
            console.log(error);
        }
       
    }



    const getAllproducts = async (req, res) => {
      console.log(req.query);
      if (req.query.name) {
        console.log("test");
        const query = {
          $or: [
            { name: { $regex: req.query.name, $options: 'i' } }, // Case-insensitive search for a match in the "name" property
            { supplier: { $regex: req.query.name, $options: 'i' } }, // Case-insensitive search for a match in the "supplier" property
          ],
        }
        const data = await KapraModel.find(query);
        if (data.length > 0) {
          res.json(data);
        } else {
          res.json({ message: 'No matching products found' });
        }
      } else {
        let data = await KapraModel.find();
        res.json(data);
      }
    }
    
    
    
module.exports={kapreEntry,relationEntry,HistoryEntry,getAllproducts}