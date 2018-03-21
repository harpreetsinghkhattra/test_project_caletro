import express from 'express';
var router = express.Router();

/** root route */
router.get('/', (req, res)=>{
    res.render('index');
});
module.exports = router;