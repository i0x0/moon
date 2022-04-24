export default function (err: any) {
  return (
    <div className="grid place-items-center h-screen bg-gray-700 text-white">
      <h1>something wrong happened 🥲</h1>
      <h2>{JSON.stringify(err)}</h2>
    </div>
  )
}
