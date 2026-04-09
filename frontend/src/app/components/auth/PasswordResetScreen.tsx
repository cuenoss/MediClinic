import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';

export function PasswordResetScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset email
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md p-8 shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Check Your Email
        </h1>
        <p className="text-slate-600 mb-8">
          We've sent password reset instructions to{' '}
          <span className="font-medium text-slate-800">{email}</span>
        </p>

        <Link to="/auth/login">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Back to Login
          </Button>
        </Link>

        <p className="mt-6 text-sm text-slate-600">
          Didn't receive the email?{' '}
          <button
            onClick={() => setSent(false)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">MC</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Reset Password
        </h1>
        <p className="text-slate-600">
          Enter your email to receive reset instructions
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Send Reset Link
        </Button>
      </form>

      {/* Back Link */}
      <Link to="/auth/login">
        <Button variant="ghost" className="w-full mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </Link>
    </Card>
  );
}
