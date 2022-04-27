import { Formik } from "formik"
import Link from 'next/link'
import { useState } from "react";
import { toTitleCase } from "../api/utils"
import { httpClient } from "../utils"
import Router from 'next/router'

interface LoginType {
  type: 'login' | 'register'
}

interface LoginErrors {
  username?: string
  password?: string
}

const Login = ({ type }: LoginType) => {

  const [httpError, setHttpError] = useState("")

  return (
    <div className="min-h-screen bg-gray-700 text-white antialiased px-4 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-semibold">{(() => {
          switch (type) {
            case 'login': return "Welcome back!"
            case 'register': return "Need an account?"
          }
        })()}</span>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={values => {
            const errors: LoginErrors = {};
            if (!values.username) {
              errors.username = 'Required';
            }

            if (!values.username) {
              errors.username = 'Required';
            }
            return errors;
          }}
          onSubmit={async (values) => {
            try {
              switch (type) {
                case 'login': {
                  let data = await httpClient.post('/auth/login', values)
                  console.log(data)
                  Router.push("/")
                  break;
                }
                case 'register': {
                  let data = await httpClient.post('/auth/create', values)
                  console.log(data)
                  Router.push("/login")
                  break;
                }
              }
            } catch (err: any) {
              setHttpError(err?.response.data.data)
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form className="relative mt-4 bg-gray-800 shadow-md sm:rounded-lg text-left" onSubmit={handleSubmit}>
              <div className="py-6 px-8">
                <label className="block font-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  placeholder="Username"
                  className={"bg-gray-900 border-gray-800 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"}
                />
                <label className="block mt-3 font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Password"
                  className={`bg-gray-900 ${errors.password ? "border-red-600" : "border-gray-800"} border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md`}
                />
                {errors.password && touched.password && errors.password}
                {httpError ? <p className="text-red-600"> {httpError} </p> : undefined}
                <div className="flex justify-between items-baseline">
                  <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg" disabled={isSubmitting}>{toTitleCase(type)}</button>
                  {(() => {
                    switch (type) {
                      case 'login': {
                        return (
                          <>
                            <Link href="/register">
                              <a className="text-sm hover:underline">Or sign up?</a>
                            </Link>
                          </>
                        )
                      }
                      case 'register': {
                        return (
                          <>
                            <Link href="/login">
                              <a className="text-sm hover:underline">Or log in?</a>
                            </Link>
                          </>
                        )
                      }
                    }
                  })()}
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login
