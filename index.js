const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const {Singer,arraySinger} = require('./models/Singer')

app.listen(3000,()=>{
    return console.log('Server started on port 3000')
})

// set view là ejs
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    let arr = [1,2,3,4,5,'<b>6</b>']
    let user = {
        name: 'Nguyen Van A',
        age: 12
    }
    res.render('home',{
        arr,
        user:user,
        Singer,arraySinger
    })
    // res.send('khởi động server thành công!')
})