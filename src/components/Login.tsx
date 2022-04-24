const Login = () => {
  return (
    <div className="min-h-screen bg-gray-700 text-white antialiased px-4 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-semibold">Welcome back!</span>
        <div className="relative mt-4 bg-gray-800 shadow-md sm:rounded-lg text-left">
          <div className="py-6 px-8">
            <label className="block font-semibold">Username</label>
            <input type="text" placeholder="Username" className="bg-gray-900 border-gray-800 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" />
            <label className="block mt-3 font-semibold">Password</label>
            <input type="password" placeholder="Password" className="bg-gray-900 border-gray-800 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md" />
            <div className="flex justify-between items-baseline">
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">Login</button>
              <a href="#" className="text-sm hover:underline">Dont have an acount? Sign up!</a>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Login
