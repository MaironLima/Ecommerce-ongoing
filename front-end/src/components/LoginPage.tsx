import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardAction } from "./ui/corrections";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicAPI } from "@/services/api/GlobalApi";
import { useStore } from "@/stores/store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { email, password };

      const { response } = await publicAPI("post", "/auth/login", data);

      const { setName } = useStore.getState();
      setName(response.data.name);

      const { setAccessToken } = useStore.getState();
      setAccessToken(response.data.accessToken);

      await navigate("/");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="justify-center items-center min-h-screenw-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex.: m@example.com"
                  onChange={(prev) => setEmail(prev.target.value)}
                  value={email}
                  required
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="ex.: password132..."
                    onChange={(prev) => setPassword(prev.target.value)}
                    value={password}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardAction className="ml-auto">
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
