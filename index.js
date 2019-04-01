const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const {Singer,arraySinger} = require('./models/Singer')

app.use(bodyParser.urlencoded({extended:false}))
// set view là ejs
app.set('view engine', 'ejs');


// chuyển post từ heroku xuống.
const port = process.env.port || 3000

app.listen(port,()=>{
    return console.log('Server started on port 3000')
})

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


app.post('/add-singer',(req,res)=>{
    const {name, avatar, link} = req.body
    const singer = new Singer(
        Math.round(Math.random()*1000),
        name,
        avatar,
        link
    );
    arraySinger.push(singer);
    res.redirect('/');
})

app.get('/add-singer',(req, res)=>{
    res.render('add-singer')
})

app.get('/update/:id',(req,res)=>{
    const {id} = req.params

    //checking id is exist ?
    const singer = arraySinger.find(item => {
        return item.id == id;
    })
    if(singer) {
        return res.render('update', {singer});
    }else{
        return res.send({'error': 'Singer is not found!!!'})
    }
})

app.post('/update',(req,res)=>{
    const {id, name, avatar, link} = req.body;
    const singer = arraySinger.find(item => item.id == id)
    if(!singer) {
        return res.send({'error': 'Singer is not found!!!'})
    }
    singer.name = name
    singer.avatar = avatar
    singer.link = link
    return res.redirect('/');
})


app.get('/delete/:id',(req,res)=>{
    // if(confirm("Are you sure?")){
        const {id} = req.params

        //checking id is exist ?
        const numberIndex = arraySinger.findIndex(item => {
            return item.id == id;
        })
        if(numberIndex<0) {
            return res.send({'error': 'Singer is not found!!!'})
        }
        arraySinger.splice(numberIndex,1);
        return res.redirect('/');
    // }
})


