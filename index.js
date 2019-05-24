const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const {Singer,arraySinger} = require('./models/Singer')
const {SingerModel} = require('./models/SingerModel')
const upload = require('./library/upload.config');
const flash = require('connect-flash')
const session = require('express-session')

// mongoose.connect('mongodb://localhost/singer1503',{
//     useNewUrlParser:true,
//     useCreateIndex:true
// })

mongoose.connect('mongodb+srv://demo-singer:246357cnP@@cluster0-2v6uq.mongodb.net/dbname?retryWrites=true',{
    useNewUrlParser:true,
    useCreateIndex:true
})
mongoose.connection
.then(()=>{
    console.log('Database online connected!');
})
.catch(()=>{
    console.log('Connect database failed!');
})


app.use(bodyParser.urlencoded({extended:false}))
// set view là ejs
app.set('view engine', 'ejs');
app.use(express.static('./public/'));// Công khai folder ra để truy cập, vì mặc định nodejs chỉ hiểu là route
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// chuyển post từ heroku xuống.
const port = process.env.port || 3000

app.listen(port,()=>{
    return console.log('Server started on port 3000')
})

app.get('/',(req,res)=>{
    // let arr = [1,2,3,4,5,'<b>6</b>']
    // let user = {
    //     name: 'Nguyen Van A',
    //     age: 12
    // }
    // res.render('home',{
    //     arr,
    //     user:user,
    //     Singer,arraySinger
    // })
    // res.send('khởi động server thành công!')

    SingerModel.find()
    .then(singers=>{
        res.render('home',{arraySinger:singers})
    })
    .catch(err=>console.log(err))
})


app.post('/add-singer',(req,res)=>{
    // const {name, avatar, link} = req.body
    // const singer = new Singer(
    //     Math.round(Math.random()*1000),
    //     name,
    //     avatar,
    //     link
    // );
    // arraySinger.push(singer);
    // res.redirect('/');
    upload.single('avatar')(req,res,err=>{
        if(err) 
        // return res.send({error: err.message})
        req.flash('error_msg',err.message) 
        return res.redirect('./add-singer')
        const {name, link} = req.body;
        const avatar = req.file;
        // res.send({name,link, avatar})
        SingerModel.create({name,link,avatar:avatar.filename})
        .then(()=>{
            res.redirect('./')
        }).catch((err)=>{
            // res.send({error: err.message})
            req.flash('error_msg',err.message)
            return res.redirect('./add-singer')
        })
    });
})

app.get('/add-singer',(req, res)=>{
    res.render('add-singer')
})

app.get('/update/:id',(req,res)=>{
    const {id} = req.params

    //checking id is exist ?
    // const singer = arraySinger.find(item => {
    //     return item.id == id;
    // })
    // if(singer) {
    //     return res.render('update', {singer});
    // }else{
    //     return res.send({'error': 'Singer is not found!!!'})
    // }

    SingerModel.findById(id)
    .then(singer=>{
        if(singer){
            return res.render('update', {singer});
        }else{
            req.flash('error_msg','ID is not found!')
            return res.redirect('/')
        }        
    }).catch(err=>{
        req.flash('error_msg',err.message)
        return res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
    // const {id, name, avatar, link} = req.body;
    // const singer = arraySinger.find(item => item.id == id)
    // if(!singer) {
    //     return res.send({'error': 'Singer is not found!!!'})
    // }
    // singer.name = name
    // singer.avatar = avatar
    // singer.link = link
    // return res.redirect('/');

    upload.single('avatar')(req,res,err=>{
        const {id, name, link} = req.body;
        const avatar = req.file;
        if(err) {
            req.flash('error_msg',err.message) 
            return res.redirect(`/update/${id}`)
        }        
        

        /** Update Cách 1  */
         SingerModel.findById(id) 
        .then(singer=>{
            if(singer){
                if(avatar){
                    avatarName = avatar.filename
                }else{
                    avatarName = singer.avatar
                }                
                SingerModel.update({_id:id},{
                    name, link, avatar:avatarName
                }).then(()=>{
                    req.flash('success_msg','Update successful!')
                    return res.redirect('/')
                })
                .catch(err=>{
                    req.flash('error_msg','Update error!')
                    return res.redirect(`/update/${id}`)
                })
                
            }else{
                req.flash('error_msg','ID is not found!')
                return res.redirect('/')
            }     
        }).catch(err=>{
            req.flash('error_msg',err.message)
            return res.redirect('/')
        })

        /****Đưa then ra ngoài */
        /** SingerModel.findById(id) 
        .then(singer=>{
            if(singer){      
                if(avatar){
                    avatarName = avatar.filename
                }else{
                    avatarName = singer.avatar
                }            
                return SingerModel.update({_id:id},{
                    name, link, avatar:avatarName
                })                
            }else{
                req.flash('error_msg','ID is not found!')
                return res.redirect('/')
            }     
        })
        .then(()=>{
                    req.flash('success_msg','Update successful!')
                    return res.redirect('/')
                })
        .catch(err=>{
            req.flash('error_msg',err.message)
            return res.redirect('/')
        })*/
    });

   
})


app.get('/delete/:id',(req,res)=>{
        const {id} = req.params

        //checking id is exist ?
        // const numberIndex = arraySinger.findIndex(item => {
        //     return item.id == id;
        // })
        // if(numberIndex<0) {
        //     return res.send({'error': 'Singer is not found!!!'})
        // }
        // arraySinger.splice(numberIndex,1);
        // return res.redirect('/');

        SingerModel.findByIdAndDelete(id)
        .then(()=>{
            req.flash('success_msg', 'Delete success!')
            return res.redirect('/')
        })
        .catch(err=>{
            req.flash('error_msg', err.message)
            return res.redirect('/')
        })
})


