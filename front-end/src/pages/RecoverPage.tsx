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
import { useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import publicAPI from "@/services/api/publicApi";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/stores/store";
import privateAPI from "@/services/api/privateApi";
import { errorHandler } from "@/services/errorHandler";

export function RecoverPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [mes, setMes] = useState(false);
  const [wait, setWait] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [noMore, setNoMore] = useState(true);

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
    mutate: sendEmail,
    isPending: isEmailPending,
    isSuccess: isEmailSuccess,
    isError: isEmailError,
    error: emailError,
  } = useMutation({
    mutationFn: async () => {
      await publicAPI.post("/auth/recover-email", { email });
    },
    onSuccess: () => {
      setStep("code");
      popUp();
      setNoMore(true)
    },
    onError: () => {
      waitTime();
      popUp();
      setNoMore(false)
    },
  });

  const {
    mutate: sendCode,
    isPending: isCodePending,
    isSuccess: isCodeSuccess,
    isError: isCodeError,
    error: codeError,
  } = useMutation({
    mutationFn: async () => {
      const response = await publicAPI.post("/auth/recover-code", {
        code,
        email,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { setAccessToken } = useStore.getState();
      setAccessToken(data.accessToken);
      setStep("password");
      popUp();
      setNoMore(true)
    },
    onError: () => {
      waitTime();
      popUp();
      setNoMore(false)
    },
  });

  const {
    mutate: sendPassword,
    isPending: isPasswordPending,
    isError: isPasswordError,
    error: passwordError,
  } = useMutation({
    mutationFn: async () => {
      const response = await privateAPI.patch("/auth/recover-password", {
        newPassword,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { setName } = useStore.getState();
      setName(data.name);
      navigate("/");
      setNoMore(true);
    },
    onError: () => {
      waitTime();
      popUp();
      setNoMore(false)
    },
  });

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    sendEmail();
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    sendCode();
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    if (newPassword !== confirm) {
      throw new Error("the passwords are not the same");
    }
    sendPassword();
  };
  const handleSignin = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (wait) {
      throw new Error("Wait 3 seconds and try again");
    }
    e.preventDefault();
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
        {mes && isEmailSuccess && step === "code" && noMore && (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Success! the code was sended to your email</AlertTitle>
            <AlertDescription>
              Open your email box and verify the code.
            </AlertDescription>
          </Alert>
        )}

        {mes && isEmailError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Something's going wrong.</AlertTitle>
            <AlertDescription>
              <p>
                Erro:{" "}
                { errorHandler(emailError) }
              </p>
            </AlertDescription>
          </Alert>
        )}

        {mes && isCodeSuccess && step === "password" && noMore && (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Success! the code was correct</AlertTitle>
            <AlertDescription>Choice your new password.</AlertDescription>
          </Alert>
        )}

        {mes && isCodeError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Something's going wrong.</AlertTitle>
            <AlertDescription>
              <p>
                Erro:{" "}
                {errorHandler(codeError)}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {mes && isPasswordError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Something's going wrong.</AlertTitle>
            <AlertDescription>
              <p>
                Erro:{" "}
                {errorHandler(passwordError)}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
      {step === "email" && (
        <Card className="justify-center items-center min-h-screenw-full max-w-sm gap-4">
          <CardHeader>
            <CardTitle>Recovery via email</CardTitle>
            <CardDescription>
              Enter your email below to recover your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(prev) => setEmail(prev.target.value)}
                    value={email}
                    required
                  />
                </div>
              </div>
              <CardFooter className="flex-col gap-2"></CardFooter>
              <FieldDescription className="text-center">
                <Button type="submit" className="w-full">
                  Sent {isEmailPending && <Spinner />}
                </Button>
                Remember your password?{" "}
                <a href="#" onClick={handleSignin}>
                  Sign In
                </a>
              </FieldDescription>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "code" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={code}
                    onChange={(prev) => setCode(prev)}
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription>
                    Enter the 6-digit code sent to your email.
                  </FieldDescription>
                </Field>
                <FieldGroup>
                  <Button type="submit">
                    Verify {isCodePending && <Spinner />}
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code? <a href="#">Resend</a>
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "password" && (
        <Card className="justify-center items-center min-h-screenw-full max-w-sm">
          <CardHeader>
            <CardTitle>Change your password</CardTitle>
            <CardDescription>
              Enter your new password below to change it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="ex.: password123..."
                    onChange={(prev) => setNewPassword(prev.target.value)}
                    value={newPassword}
                    required
                  />
                  <FieldDescription>
                    Must be at least 6 characters long.
                  </FieldDescription>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmNewPassword">
                    Confirm the new password
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="ex.: password123..."
                    onChange={(prev) => setConfirm(prev.target.value)}
                    value={confirm}
                    required
                  />
                  <FieldDescription className="mb-6">
                    Confirm your password.
                  </FieldDescription>
                </div>
              </div>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full">
                  Change It {isPasswordPending && <Spinner />}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RecoverPage;
