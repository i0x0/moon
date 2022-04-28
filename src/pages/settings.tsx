export default function () { 
  return (
    <p>uhh hai</p>
  )
}

export async function getServerSideProps(ctx: any) {
  let { isAuthed } = ctx.req

  if (!isAuthed) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  } return {
    props: {}
  }
}
