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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { usePrivateAPI, usePublicAPI } from "@/services/api/GlobalApi";
import { useNavigate } from "react-router-dom";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/stores/store";

export function RecoverPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [mes, setMes] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  function popUp() {
    setMes(true);
    setTimeout(() => setMes(false), 5000);
  }

  // const {
  //   refetch: sendEmail,
  //   error: emailError,
  //   isFetching: isEmailPending,
  //   isSuccess: isEmailSuccess,
  //   isError: isEmailError,
  // } = usePublicAPI("post", "/auth/recover-email", { email }, {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   onSuccess: () => {
  //     setStep("code");
  //     popUp();
  //   }
  // });

  // const {
  //   refetch: sendCode,
  //   data: dataCode,
  //   error: codeError,
  //   isFetching: isCodePending,
  //   isSuccess: isCodeSuccess,
  //   isError: isCodeError,
  // } = usePublicAPI("post", "/auth/recover-code", { code, email }, {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   onSuccess: () => {
      
  //     setStep("password");
  //     popUp();
  //   }
  // });

  // const {
  //   refetch: sendPassword,
  //   error: passwordError,
  //   isFetching: isPasswordPending,
  //   isError: isPasswordError,
  // } = usePrivateAPI("post", "/auth/recover-password", { password: newPassword }, {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   onSuccess: (data) => {
  //     const { setName, setAccessToken } = useStore.getState();
  //     setName(data.response.data.name);
  //     setAccessToken(data.response.data.accessToken);
  //     navigate("/");
  //   }
  // });

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendEmail();
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendCode();
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirm) throw new Error("the passwords are not the same");

    sendPassword();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {mes && isEmailSuccess && (
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
            <p>Erro: {emailError.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {mes && isCodeSuccess && (
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
            <p>Erro: {codeError.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {mes && isPasswordError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Something's going wrong.</AlertTitle>
          <AlertDescription>
            <p>Erro: {passwordError.message}</p>
          </AlertDescription>
        </Alert>
      )}

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
                Remember your password? <a href="#">Sign In</a>
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
