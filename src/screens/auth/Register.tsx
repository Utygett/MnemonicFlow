// src/screens/auth/Register.tsx
import React, { useState } from 'react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../auth/AuthContext';
import { ApiClient } from '../../api/client';
import { register as registerApi } from '../../api/authClient';

export function Register({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = await registerApi(email, password);
      await login(data.access_token); // авто-вход + fetchMe
    } catch (e) {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen bg-dark center-vertical px-4">
      <div className="max-w-390 w-full space-y-6">
        <h1 className="page__title text-center">Регистрация</h1>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Пароль" type="password" value={password} onChange={setPassword} />

        <Button onClick={handleSubmit} variant="primary" size="large" fullWidth disabled={loading}>
          {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>

        <button onClick={onSwitch} className="text-sm text-accent text-center w-full">
          Уже есть аккаунт? Войти
        </button>
      </div>
    </div>
  );
}
