require('dotenv').config()

const express = require('express')
const mongoose = require ('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

app.use(cors());
app.use(express.json());

const User = require('./models/User')

app.get('/', (req, res) =>{
    res.status(200).json({ msg : 'Bem-vindo a nossa api!'})
})

app.get('/user/:id', chektoken, async(req, res) => {

    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({user})
})

function chektoken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(404).json({msg: 'Acesso negado!'})
    }

    try{
        
        const secret = process.env.SECRET
        jwt.verify(token, secret)

        next()

    }catch(err){

        res.status(400).json({msg: "Token Invalido"})
    }
}

app.post('/auth/register', async(req, res) =>{
    const {name, email, password, confirmepassword} = req.body

    if(!name) {
        return res.status(422).json({ msg: 'Nome obrigatorio'})
    }

    if(!email) {
        return res.status(422).json({ msg: 'Email obrigatorio'})
    }

    if(!password) {
        return res.status(422).json({ msg: 'Senha obrigatorio'})
    }

    if(password !== confirmepassword){
        return res.status(422).json({ msg: 'Senhas não conferem'})
    }

    const userExist = await User.findOne({ email:email})
    
    if(userExist){
        return res.status(422).json({ msg: 'Utilize outro Email'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User ({
        name,
        email,
        password: passwordHash,
    })

    try{

        await user.save()
        res.status(201).json({msg:'Usuário criado com sucesso!'})

    } catch(error){
        console.log(error)
        res.status(500).json({msg: 'Tente novamente mais tarde'})
    }
})

app.post("/auth/login", async(req, res) =>{
    const {email, password} = req.body

    if(!email) {
        return res.status(422).json({ msg: 'Email obrigatorio'})
    }

    if(!password) {
        return res.status(422).json({ msg: 'Senha obrigatorio'})
    }

    const user = await User.findOne({ email:email})
    
    if(!user){
        return res.status(404).json({ msg: 'Usuário não encontrado'})
    }

    const checkpass = await bcrypt.compare(password, user.password)

    if(!checkpass) {
        return res.status(422).json({ msg: 'Senha invalida'})
    }

    try{

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user._id,
            },
            secret,
        )

        res.status(200).json({msg :'Autenticação realizada', token})

    }catch(err){
        console.log(error)
        res.status(500).json({msg: 'Tente novamente mais tarde'})
    }
})

const dbUser = process.env.DB_USER;
const dbpass = process.env.DB_PASSWORD;

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbpass}@api-zero.iyf9f.mongodb.net/?retryWrites=true&w=majority&appName=api-zero`)
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
        console.log("Conectou ao MongoDB!");
    })
    .catch((err) => {
        console.log('Erro ao conectar ao MongoDB:', err);
    });