const MojiModel = require("../models").Moji;
const {settings, service} = require('../../utils');
const _ = require('lodash');

class Moji {


  constructor() {
    // super()
  }

  async setMoji(req,res) {

    var src = req.body.src;
    if(!src){
      res.send({
        state: 'error',
        message: '图片没有上传成功'
      })
    }
    var name = req.body.name
    if(!name){
      name = req.body.src
    }
    var mojiObj = {
      src: req.body.src,
      name: name
    }

    var newMoji = new MojiModel(mojiObj);
    await newMoji.save()
      .catch(err => {
        res.send({
          state: 'error',
          message: err.toString()
        })
      });

    res.send({
      state: 'success',
      data: newMoji
    })


  }


  async getList(req, res, next) {
    let pageNumber = req.query.pageNumber || 1;
    let pageSize = req.query.pageSize || 10;
    let nameReg = req.query.nameReg;
    let mojiId = req.query.mojiId;
    let author = req.query.user;
    let queryObj = {};
    if (mojiId) {
      queryObj.mojiId = mojiId;
    }
    if (nameReg) {
      let reKey = new RegExp(nameReg, 'i')
      queryObj.name = {$regex: reKey}
    }
    if (author) {
      queryObj.author = author;
    }
    console.log(JSON.stringify(queryObj))
    // queryObj.imgSrc = {$ne: []}
    const mojis = await MojiModel.find(queryObj).sort({
      updateTime: -1
    }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
    const totalItems = await MojiModel.count(queryObj);
    res.send({
      state: 'success',
      docs: mojis,
      pageInfo: {
        totalItems,
        pageNumber: Number(pageNumber) || 1,
        pageSize: Number(pageSize) || 10,
        nameReg: nameReg || ''
      }
    })
  }
}

module.exports = new Moji();
