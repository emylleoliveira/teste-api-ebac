/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',

    }).should((response)=>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": "Emylle Oliveira",
        "email": (faker.internet.email()),
        "password": "teste",
        "administrador": "true"
      }

    }).should((response)=>{
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.cadastrarUsuario('Emylle Oliveira', 'emylle@qa.com.br', 'teste','true')
    .should((response)=>{
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    
    })
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
   let email = `Emylle@ebac${Math.floor(Math.random() * 1000000)}.com`
   cy.cadastrarUsuario('Emylle Oliveira', email, 'teste','true')
   .then(response=>{
    let id = response.body._id
    cy.request({
      method: 'PUT',
      url: `usuarios/${id}`,
      body: {
        "nome": "Emylle Oliveira editado",
        "email": email,
        "password": "teste",
        "administrador": "true"
      }

    }).should((response)=>{
      expect(response.status).equal(200)
      expect(response.body.message).equal('Registro alterado com sucesso')
    })
   })

  }),
  it('Deve deletar um usuário previamente cadastrado - DELETE', () => {
    let email = `Emylle@ebac${Math.floor(Math.random() * 1000000)}.com`
   cy.cadastrarUsuario('Emylle Oliveira', email, 'teste','true')
   .then(response=>{
    let id = response.body._id
    cy.request({
      method: 'DELETE',
      url: `usuarios/${id}`,
      body: {
        "nome": "Emylle Oliveira",
        "email": email,
        "password": "teste",
        "administrador": "true"
      }

    }).should((response)=>{
      expect(response.status).equal(200)
      expect(response.body.message).equal('Registro excluído com sucesso')
    })
   })
  });


});
