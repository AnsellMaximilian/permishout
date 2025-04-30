import React from "react";
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
import { getNames } from "country-list";

const countries = getNames();

export default function ProfileCreationPage() {
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
                <Input id="username" placeholder="Your username" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your profile name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Select>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Complete Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
