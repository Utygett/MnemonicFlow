// src/screens/auth/Login.tsx
import React, { useState } from 'react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../auth/AuthContext';
import { login as loginApi } from '../../api/authClient';

export function Login({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    try {
      const data = await loginApi(email, password);
      console.log('LOGIN RESPONSE:', data); // 👈
      login(data.access_token);
    } catch (e) {
      console.error(e);
      alert('Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-dark center-vertical px-4">
      <div className="max-w-390 w-full space-y-6">
        <h1 className="page__title text-center">Вход</h1>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Пароль" type="password" value={password} onChange={setPassword} />

        <Button onClick={handleSubmit} variant="primary" size="large" fullWidth disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </Button>

        <button onClick={onSwitch} className="text-sm text-accent text-center w-full">
          Нет аккаунта? Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
