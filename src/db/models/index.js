const { Sequelize } = require('sequelize')
const path = require('path')
const fs = require('fs')

// Veritabanı dosyasının yolunu belirle (userData klasöründe olacak)
const dbPath = path.join(
  process.env.APPDATA ||
    (process.platform === 'darwin'
      ? process.env.HOME + '/Library/Application Support'
      : process.env.HOME + '/.local/share'),
  'electron-react-app',
  'database.sqlite'
)

// Veritabanı dosyasının bulunduğu klasörün var olduğundan emin ol
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Sequelize örneği oluştur
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
})

// Kullanıcı modeli
const User = require('./user')(sequelize)
// Task modeli (uygulamanın ihtiyacına göre)
const Task = require('./task')(sequelize)

// İlişkileri tanımla
User.hasMany(Task)
Task.belongsTo(User)

// Veritabanını senkronize et
const initDb = async () => {
  try {
    await sequelize.sync()
    console.log('Veritabanı başarıyla senkronize edildi.')
  } catch (error) {
    console.error('Veritabanı senkronizasyonu sırasında hata oluştu:', error)
  }
}

module.exports = {
  sequelize,
  User,
  Task,
  initDb
}
