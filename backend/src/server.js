import {fastify} from 'fastify'
import fastifyPlugin from 'fastify-plugin';

import { fastifyCors } from "@fastify/cors"
import { PrismaClient } from "@prisma/client";
import { randomUUID, } from "node:crypto";

const app = fastify({ logger: true });
const prisma = new PrismaClient()

app.register(fastifyCors,{
  origin: "*",
})

app.register(fastifyPlugin(function (instance, opts, done) {
  instance.decorate('json', function (body) {
    this.header('Content-Type', 'application/json').send(JSON.stringify(body));
  });
  done();
}));

// LOGAR USUARIO
app.post("/users/login",async(request,reply)=>{
  const {email,password} = request.body
  //logar
  
  const user = await prisma.user.findFirst({
    where:{
      email,
      password
    }
  })
  if(!user){
    return reply.status(400).send({error:"User not found"})
  }

  return reply.status(200).send(user)
})


// CRIAR USUARIO

app.post("/users/signup",async(request,reply)=>{
  const {name,email,password} = request.body


  if (!email || !password || !name) {
    reply.code(400).send({ error: 'Email e senha e nome são obrigatórios' });
    return;
  }

  const passwordWithoutSpaces = password.replace(/\s/g, '')

  const handleSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g
  
  const passwordHasSpecialCharacters = handleSpecialCharacters.test(passwordWithoutSpaces)

  const passwordIsValid = passwordWithoutSpaces.length >= 8

  const userAlreadyExists = await prisma.user.findFirst({
    where:{
      email
    }
  })

  if(!passwordIsValid){
    return reply.status(400).send({error:"Password must be at least 8 characters"})
  }
  if(userAlreadyExists){
    return reply.status(400).send({error:"User already exists"})
  }
 
  if(!passwordHasSpecialCharacters){
    return reply.status(400).send({error:"Password must have at least one special character"})
  }
  try{
    await prisma.user.create({
    data:{
      id: randomUUID(),
      name,
      email,
      password: passwordWithoutSpaces
    }
  })}
  catch(error){
    throw new Error(error)
  }
  
  return reply.status(201).send()
})

// ATUALIZAR USUARIO

app.put("/users/:userId",async(request,reply)=>{
  const {userId} = request.params
  const {name,email,password} = request.body
  const passwordWithoutSpaces = password.replace(/\s/g, '')

  const handleSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g
  
  const passwordHasSpecialCharacters = handleSpecialCharacters.test(passwordWithoutSpaces)

  const passwordIsValid = passwordWithoutSpaces.length >= 8

  const userAlreadyExists = await prisma.user.findFirst({
    where:{
      email
    }
  })

  if(!passwordIsValid){
    return reply.status(400).send({error:"Password must be at least 8 characters"})
  }
  if(userAlreadyExists){
    return reply.status(400).send({error:"User already exists"})
  }
  if(!passwordHasSpecialCharacters){
    return reply.status(400).send({error:"Password must have at least one special character"})
  }
  try{
    await prisma.user.update({
      where:{
        id: userId
      },
      data:{
        name,
        email,
        password: passwordWithoutSpaces
      }
    })
  }
  catch(error){
    throw new Error(error)
  }
  
  return reply.status(200).send()
})


// DELETAR USUARIO

app.delete("/users/:userId",async(request,reply)=>{
  const {userId} = request.params
  await prisma.user.delete({
    where:{
      id: userId
    }
  })
  return reply.status(204).send()
})

app.listen({
  port: 3000,
}).then(()=>{
  console.log('Server is running on port 3000')
})

