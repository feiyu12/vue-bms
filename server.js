const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// 引入user.js
const user = require('./routes/api/users');
const profile = require('./routes/api/profiles');


const User = require('./models/User');

const db = require('./config/keys').mongoURL

// 对post请求的body处理,不处理无法读取数据 ---读出数据并JSON解析
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// 连接数据库
mongoose.connect(db,{
  useFindAndModify:false,
  useNewUrlParser: true,
  useUnifiedTopology: true

}).then(()=>{
  console.log('成功连接数据库')
})


// passport初始化 用于验证
app.use(passport.initialize())

require('./config/passport')(passport);
// 路由
app.use('/api/users',user)
app.use('/api/profile',profile)

const port = process.env.PORT || 5001;
app.listen(port,()=>{
  console.log(`欢迎连接`)
})