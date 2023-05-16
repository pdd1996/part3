const mongoose = require('mongoose');

const url = `mongodb://127.0.0.1:27017/part3`

mongoose.connect(url)

// Schema 定义文档结构
const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const PhoneBook = mongoose.model('phoneBook', phoneSchema)

// const Phone = new PhoneBook({
//   name: 'Ann',
//   number: '040-123456',
//   date: new Date(),
// })

// Phone.save().then(result => {
//   console.log(`added ${result.name} number ${result.number} to phoneBook`)
//   mongoose.connection.close()
// })

PhoneBook.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phone => {
      console.log(`${phone.name} - ${phone.number}`)
    })
    mongoose.connection.close()
  })