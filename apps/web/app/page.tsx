"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSessionStore } from "./utils";
import { SERVER } from "@/env";

const formSchema = z.object({
  name: z.string().
    min(2, 'Usernames must be at least 2 characters').
    max(17, 'Usernames cannot be longer than 17 characters').
    regex(/^[0-9a-z_][0-9a-z_.]{1,16}$/, 'Usernames can only be alphanumeric lowercase without spaces'),
  password: z.string().
    min(8, 'Passwords must be at least 8 characters'),
})

export default function Login() {
  return (
  <div className="flex h-screen">
    <Card className="m-auto w-[500px]">
      <CardTitle className="px-6">BA Social</CardTitle>
      <CardDescription className="px-6">Welcome to Blue Altair Social! We Altairians really have a lot to share.</CardDescription>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList>
            <TabsTrigger value='signin'>Sign In</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value='signin'><SignInCard/></TabsContent>
          <TabsContent value='signup'><SignUpCard/></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
 )
}

function SignInCard() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    }
  })

  const [actionRes, setActionRes] = useState<{
    variant: "default" | "destructive"; title: string; description: string;
  } | null>(null)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`${SERVER}/user/login`, {
      method: 'post',
      body: JSON.stringify(values),
    })
    if (res.status === 200) {
      const data: {
        name: string; id: string; token: string;
      } = await res.json()
      setActionRes(null)
      useSessionStore(s => s.setAll({
        name: data.name,
        id: data.id,
        token: data.token,
      }))
    } else {
      const description = await res.text()
      setActionRes({
        title: 'Sign In Error', description, variant: 'destructive',
      })
      console.log(values)
    }
  }

  return(
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid w-full items-center gap-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        {
          !form.formState.isSubmitting && actionRes && (
            <Alert variant={actionRes.variant}>
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>{actionRes.title}</AlertTitle>
              <AlertDescription>{actionRes.description}</AlertDescription>
            </Alert>
          )
        }
        <Button type="submit" disabled={form.formState.isSubmitting}>Sign In</Button>
      </div>
    </form>
  )
}

function SignUpCard() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    }
  })

  const [actionRes, setActionRes] = useState<{
    variant: "default" | "destructive"; title: string; description: string;
  } | null>(null)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`${SERVER}/user/create`, {
      method: 'post',
      body: JSON.stringify(values),
    })
    if (res.status === 200) {
      const data: {
        name: string; id: string; token: string;
      } = await res.json()
      setActionRes(null)
      useSessionStore(s => s.setAll({
        name: data.name,
        id: data.id,
        token: data.token,
      }))
    } else {
      const description = await res.text()
      setActionRes({
        title: 'Sign Up Error', description, variant: 'destructive',
      })
      console.log(values)
    }
  }

  return(
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid w-full items-center gap-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        {
          !form.formState.isSubmitting && actionRes && (
            <Alert variant={actionRes.variant}>
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>{actionRes.title}</AlertTitle>
              <AlertDescription>{actionRes.description}</AlertDescription>
            </Alert>
          )
        }
        <Button type="submit" disabled={form.formState.isSubmitting}>Sign Up</Button>
      </div>
    </form>
  )
}
