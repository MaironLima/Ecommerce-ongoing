import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardAction } from "./ui/corrections";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import publicAPI from "@/services/api/publicApi";
import { useStore } from "@/stores/store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { errorHandler } from "@/services/errorHandler";

export function RegisterPage({ ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mes, setMes] = useState(false);
  const [wait, setWait] = useState(false);

  const navigate = useNavigate();

  function popUp(): void {
    setMes(true);
    setTimeout(() => setMes(false), 8000);
  }
  function waitTime(): void {
    setWait(true);
    setTimeout(() => setWait(false), 3000);
  }

  const {
    mutate: sendRegister,
    isPending: isRegisterPending,
    isError: isRegisterError,
    error: registerError,
  } = useMutation({
    mutationFn: async () => {
      const response = await publicAPI.post("/auth/register", {
        email,
        password,
        name,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { setName, setAccessToken } = useStore.getState();
      setName(data.name);
      setAccessToken(data.accessToken);
      navigate("/");
    },
    onError: () => {
      waitTime();
      popUp();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    if (password !== confirmPassword) {
      throw new Error("the passwords are not the same");
    }
    sendRegister();
  };
  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    navigate("/auth/login");
  };

  const handleMainPage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 50,
        }}
      >
        <button onClick={handleMainPage}>
          <img src="/vite.svg" alt="Logo" className="h-10" />
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          top: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          minWidth: 350,
          maxWidth: "90vw",
        }}
      >
        {mes && isRegisterError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Something's going wrong.</AlertTitle>
            <AlertDescription>
              <p>
                Erro:{" "}
                {errorHandler(registerError)}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(prev) => setName(prev.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex.: m@example.com"
                  value={email}
                  onChange={(prev) => setEmail(prev.target.value)}
                  required
                />
                <FieldDescription></FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="ex.: password132..."
                  value={password}
                  onChange={(prev) => setPassword(prev.target.value)}
                  required
                />
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="ex.: password132..."
                  value={confirmPassword}
                  onChange={(prev) => setConfirmPassword(prev.target.value)}
                  required
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account {isRegisterPending && <Spinner />}</Button>
                  <FieldDescription className="px-6 text-center"></FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
          <CardAction className="ml-auto">
            <Button variant="link" onClick={handleSignup}>
              Sign In
            </Button>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
