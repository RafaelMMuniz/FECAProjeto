/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useState } from 'react';

function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/users/signup',
        JSON.stringify({ name, email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      if (!error?.response) {
        setError('Erro ao acessar o servidor');
      } else {
        setError('Erro ao criar o usuário: ' + error.response.data.message);
      }
    }
  };

  return (
    <div className="create-user-form-wrap">
      <h2>Cadastrar Usuário</h2>
      <form className="login-form">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          required
          minLength="8"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="btn-login"
          onClick={(e) => handleCreateUser(e)}
        >
          Cadastrar
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
}

export default CreateUserForm;
