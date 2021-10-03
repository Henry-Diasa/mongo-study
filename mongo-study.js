const { MongoClient,ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://127.0.0.1:27017')


async function run() {
    try {
        await client.connect()
        const testDB = client.db('aaa')
        const co = testDB.collection('aaa')

        // 创建文档
        // const ret = await co.insertOne({
        //   a:1,
        //   b:'2',
        //   c: true,
        //   d: [1,2,3]  
        // })

        // console.log(ret, 221)

        // 查询文档
        // const ret = await co.findOne({age: 1})
        // // console.log(await ret.toArray())
        // console.log(ret)

        // 删除文档
        // const ret = await co.deleteOne({
        //     _id: ObjectId('61585c53faf92b702911dab0')
        // })
        // console.log(ret);

        // 更新文档
        const ret = await co.updateOne({
            _id: ObjectId('61571d224514212bc1457a32')
        },{
            $set: {
               name: 'nihao12312312' 
            }
        })
        console.log(ret);
    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
}

run()