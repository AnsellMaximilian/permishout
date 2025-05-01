"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import icon from "@/assets/images/permishout-icon.svg";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/const/common";

import { toastError, validateUsername } from "@/lib/utils";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);

export default function ProfileCreationPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [yearBorn, setYearBorn] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const countryOptions = useMemo(() => {
    return COUNTRIES.map((country) => (
      <SelectItem
        key={`${country.value}-${country.title}`}
        value={`${country.value}-${country.title}`}
      >
        {country.title}
      </SelectItem>
    ));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!username || !name || !country || !yearBorn) {
      toastError("Please fill in all fields.");
      return;
    }

    if (!validateUsername(username)) {
      toastError(
        "Username must be 4-15 characters long and can only contain letters, numbers, and underscores."
      );
      return;
    }

    try {
      await api.post("/users", { username, name, yearBorn, country });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.refresh();
      router.push("/plan");
    }
  };

  return (
    <div className="mx-auto container grow flex flex-col justify-center items-center">
      <Card className="w-[350px] md:w-[500px] lg:w-[700px]">
        <CardHeader>
          <div className="flex flex-col gap-2 items-center">
            <Image src={icon} alt="PermiShout Icon" width={65} height={65} />
            <CardTitle className="text-xl">Create Your Profile</CardTitle>
            <CardDescription>
              Complete your profile first before <strong>Shouting</strong>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your profile name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex gap-1.5">
                <div className="flex flex-col space-y-1.5 w-[200px]">
                  <Label htmlFor="yearBorn">Year Born</Label>
                  <Select onValueChange={(val) => setYearBorn(val)}>
                    <SelectTrigger
                      id="yearBorn"
                      className="w-full"
                      value={yearBorn}
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5 grow">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(val) => setCountry(val)}>
                    <SelectTrigger
                      id="country"
                      className="w-full"
                      value={country}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {countryOptions}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            Complete Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
