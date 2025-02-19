
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Login = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"waiter" | "chef">("waiter");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
    };

    setUser(user);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Restaurant Management System
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setRole(value as "waiter" | "chef")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="waiter" id="waiter" />
                <Label htmlFor="waiter">Waiter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chef" id="chef" />
                <Label htmlFor="chef">Chef</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
