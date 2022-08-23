const PORT = process.env.PORT || 3000;
const express = require('express')
const app = express()

app.use(express.static(__dirname));
// app.use(express.static('public'))
app.use('/styles', express.static(__dirname + 'public/styles'))
app.use(express.static('scripts'))
app.use('scripts', express.static(__dirname + 'scripts'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res)=>{
    res.render('index')
})

app.listen(PORT,()=>console.log("listening on port " + (PORT)))
