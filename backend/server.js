require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')();

const {
  PORT: port = 4000,
  PASSWORD: password
} = process.env;

const connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : password,
  database : 'phone'
});

app.use(cors);
app.use(bodyParser.json());
app.listen(port);

connection.connect(err=>{
  if(err){
    console.log(err);
    return;
  }
  console.log('*DB연결*');
});

app.post('/login', (req, res)=>{
  // API 문서
  // response { success : 1 } -> 성공
  // { success : -1 } -> 아이디가 없음
  // { success : -2 } -> 아이디 미입력
  // { success : -3 } -> 비밀번호 미입력
  // { success : -4 } -> 비밀번호 틀림
  // console.log(req.body);
  connection.query('SELECT * FROM user WHERE uId="'+req.body.uId+'"', (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    if(rows.length>0){
      if(req.body.uPass==rows[0].uPass){
        res.json({success : 1});
      }else{
        res.json({success : -4});
      }
    }else{
      res.json({success : -1});
    }
  });
});

app.post('/register', (req, res)=>{
  // API 문서
  // response { success : 1 } -> 성공
  // { success : -1 } -> 아이디가 중복
  // { success : -2 } -> 아이디 미입력
  // { success : -3 } -> 비밀번호 미입력
  connection.query('SELECT * FROM user WHERE uId="'+req.body.uId+'"', (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    if(rows.length==0){
      connection.query('INSERT INTO user SET ?', req.body, (err, rows)=>{
        if(err){
          console.log(err);
          return;
        }
        res.json({success : 1});
      });
    }else{
      // console.log('ID 중복');
      res.json({success : -1});
    }
  });
});

app.post('/phone/set', (req, res)=>{
  // console.log(req.body);
  connection.query('SELECT userId FROM user WHERE uId="' + req.body.uId + '"', (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    // console.log(rows);
    res.json(rows[0]);
  });
});

app.post('/phone', (req, res)=>{
  // API 문서
  // response { success : 1 } -> 성공
  // { success : -1 } -> 전화번호 중복
  // { success : -2 } -> 이름 미입력
  // { success : -3 } -> 전화번호 미입력
  connection.query('SELECT * FROM phone WHERE userId="' + req.body.userId + '" AND phone="' + req.body.phone + '"',
  (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    if(rows.length==0){
      connection.query('INSERT INTO phone SET ?', req.body, (err, rows)=>{
        if(err){
          console.log(err);
          return;
        }
        res.json({success : 1});
      });
    }else{
      res.json({success : -1});
    }
  });
});

app.post('/phone/list', (req, res)=>{
  connection.query('SELECT * FROM phone WHERE userId="' + req.body.userId + '" ORDER BY name', (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    res.json({list : rows});
  });
});

app.post('/phone/delete', (req, res)=>{
  connection.query('DELETE FROM phone WHERE phoneId="' + req.body.phoneId + '"',
  (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    res.json();
  });
});

app.post('/phone/update', (req, res)=>{
  // response { success : 1 } -> 성공
  // { success : -1 } -> 전화번호 중복
  // { success : -2 } -> 이름 미입력
  // { success : -3 } -> 전화번호 미입력
  connection.query('SELECT * FROM phone WHERE userId="' + req.body.userId + '" AND phone="' + req.body.phone + '"',
  (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    console.log(rows[0].phone);
    if(rows.length==0 || rows[0].phoneId==req.body.phoneId){
      connection.query('UPDATE phone SET name="' + req.body.name + '", phone="' + req.body.phone + '" WHERE phoneId="' + req.body.phoneId + '"',
      (err, rows)=>{
        if(err){
          console.log(err);
          return;
        }
        res.json({success : 1});
      });
    }else{
      res.json({success : -1});
    }
  });
});

app.post('/phonePages', (req, res)=>{
  connection.query('SELECT * FROM phone WHERE userId="' + req.body.userId + '"',
  (err, rows)=>{
    if(err){
      console.log(err);
      return;
    }
    // console.log(rows.length);
    // console.log(req.body.userId);
    if(req.body.userId){
      res.json({listNum : rows.length});
    }else{
      res.json({listNum : -1});
    }
  });
});
