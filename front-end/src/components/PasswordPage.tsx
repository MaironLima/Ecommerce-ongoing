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
import { FieldDescription } from "./ui/field";

export function PasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="justify-center items-center min-h-screenw-full max-w-sm">
        <CardHeader>
          <CardTitle>Change your password</CardTitle>
          <CardDescription>
            Enter your new password below to change it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} >
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
                <Label htmlFor="confirmNewPassword">Confirm the new password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="ex.: password123..."
                  onChange={(prev) => setConfirm(prev.target.value)}
                  value={confirm}
                  required
                />
                <FieldDescription>
                  Confirm your password.
                </FieldDescription>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Change It
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PasswordPage;
